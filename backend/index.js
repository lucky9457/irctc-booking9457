const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");


const app = express();
app.use(express.json());

app.use(cors());
const dbPath = path.join(__dirname, "info.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4001, () => {
      console.log("Server Running at http://localhost:4001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};


initializeDBAndServer();



const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {

        next();
      }
    });
  }
};


//Registe_API!!!

app.post("/register", async (request, response) => {
  const { user_name, email, ph_no, password } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE user_name = '${user_name}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        user (user_name, email, ph_no, password) 
      VALUES 
        (
          
          '${user_name}',
          '${email}',
          '${ph_no}',
          '${hashedPassword}'
          
        )`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
    response.send(`${newUserId}`);
  } else {
    response.status = 400;
    response.send("User already exists");
  }
});


//Login_API!!!!

app.post("/login", async (request, response) => {
  const { user_name, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE user_name = '${user_name}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400).json({ error: "Invalid Password" });
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      // response.send("Login Success!");
      const payload = {
        user_name: user_name,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken });
    } else {

      response.status(400).json({ error: "Invalid Password" });
    }
  }
});

//user_details_API

app.get("/user/", authenticateToken, async (request, response) => {
  const getUsersQuery = `
  SELECT
    *
  FROM
    user
  ORDER BY
    id;`;
  const usersArray = await db.all(getUsersQuery);
  response.send(usersArray);
});


//booking_details_API

app.post("/bookingDetails/", authenticateToken, async (request, response) => {
  const { user_id } = request.body;

  const getBookingsQuery = `
    SELECT
      *
    FROM
      bookings
    WHERE
      user_id = ${user_id}
    ORDER BY
      booking_id;`;
  const bookingsArray = await db.all(getBookingsQuery);
  response.send(bookingsArray);
});



//add_trian_API

app.post("/addtrain", async (request, response) => {
  const { train_name, seats, available, filled, station } = request.body;

  const selectCandidateQuery = `SELECT * FROM train WHERE train_name = '${train_name}';`;
  const dbTrain = await db.get(selectCandidateQuery);
  if (dbTrain === undefined) {
    const createTrainQuery = `
        INSERT INTO 
          train (train_name, seats, available, filled, station) 
        VALUES 
          (
            
            '${train_name}',
            ${seats},
            '${available}',
           ${filled}, 
           ${station}
                       
          );`;
    const dbResponse = await db.run(createTrainQuery);
    const newTrainId = dbResponse.lastID;
    response.send(`Created new Train with ${newTrainId}`);
  } else {
    response.status = 400;
    response.send("Train already exists");
  }
});


//booking_trains_API

app.put("/booking", async (request, response) => {
  const { user_id, train_id, train_name } = request.body;


  const checking = `SELECT * FROM bookings WHERE (train_id = ${train_id} AND user_id = ${user_id});`;
  const checking1 = await db.get(checking);

  if (checking1 === undefined) {
    const selectUserQuery = `SELECT * FROM train WHERE (available = 'true' AND train_id = ${train_id});`;
    const dbUser = await db.get(selectUserQuery);
    
   
    if (dbUser === undefined) {
      response.status(400);
      response.send("This Train is Not Available Now...");
      return;
    }
    if (dbUser.seats <= 0) {
      response.status(400).send("Seats are filled....");
      return;
    }else {
      
        const dbRes = `UPDATE train
                            SET seats = seats - 1
                            WHERE train_id = ${train_id};`;

        const dbRes1 = `UPDATE train
                            SET filled = filled + 1
                            WHERE train_id = ${train_id};`;

        const createBookingQuery = `
                            INSERT INTO 
                            bookings (user_id, train_id, train_name) 
                            VALUES 
                            (
                                
                                ${user_id},
                                ${train_id},
                                '${train_name}'
                                                            
                             );`;

        const dbResponse3 = await db.run(createBookingQuery);

        const result1 = await db.run(dbRes1);

        const result = await db.run(dbRes);

        response.status = 200;
        response.send("Booking successful...");
      
    }


  } else {
    response.status(400);
    response.send("Already Booking Completed....");
  }
});

//station_details_API

app.post("/getDetails/", async (request, response) => {
  const { station } = request.body;

  const getDetailsQuery = `
    SELECT
      *
    FROM
      train
    WHERE
     station = ${station}
    ORDER BY
      train_id;`;
  const trainsArray = await db.all(getDetailsQuery);
  response.send(trainsArray);
});


//API-5 delete_user_API

app.delete("/user/:id/", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const delete1query = `DELETE FROM user WHERE id = ${id};`;
  const res4 = await db.run(delete1query);
  response.send("user Deleted");
});






module.exports = app;