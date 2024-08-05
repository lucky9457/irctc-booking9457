import React, { useState, useEffect,  } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import Footer from '../Footer';
function Home() {
  const [station, setStationId] = useState(1);
  const [results, setResults] = useState([]);

  const [train_id, setTrainId] = useState('');
  const [train_name, setTrainName] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const user_id = Cookies.get("user_id");
  
  const token = Cookies.get("jwt_token");


  const onChangeTrainId = (event) => {
    setTrainId(event.target.value);
  };

  const onChangeTrainName = (event) => {
    setTrainName(event.target.value);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    
    const userDetails = { user_id, train_id, train_name };
    const url = 'http://localhost:4001/booking/';
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {

        setTrainId("");
        setTrainName("");
        alert('Registration successful...');

      } else {

        setTrainId("");
        setTrainName("");
        alert('May be seats are filled completly or You already Booked or Train not Available...');


      }
    } catch (error) {
      console.error('Error:', error);


      setTrainId("");
      setTrainName("");
      setShowSubmitError(true);
      setErrorMsg('Invalid Credentials');
    }
  };

  useEffect(() => {
    const calling = async () => {
      const url = 'http://localhost:4001/getDetails/';
      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ station }),
      };

      try {
        const response = await fetch(url, options);

        if (response.ok) {
          const data = await response.json();
          setResults(data);
          console.log('Details added:', data);
        } else {
          console.log('Error adding details:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    calling();
  }, [station]);

  return (
    <div className='first_container'>
      <Navbar />
      <div className="main-container">
        <h1 className="heading">(❁´◡`❁)..Welcome to the Train Booking Platform..(❁´◡`❁)</h1>
        <div className="">
          <div className="text-center">
            <h1 className="">...Find the Stations Here...</h1>
            <p className="">
              A train journey weaves together the romance of adventure, the nostalgia of memories, and the hope of new beginnings.
            </p>
            <button className="" onClick={() => setStationId(1)}>
              Station_1
            </button>
            <button className="" onClick={() => setStationId(2)}>
              Station_2
            </button>
          </div>
        </div>
        <div className="results-container">
          <table>
            <thead>
              <tr>
                <th>Train ID</th>
                <th>Train Name</th>
                <th>Available Seats</th>
                <th>Filled Seats</th>
                <th>Station</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.train_id}>
                  <td>{result.train_id}</td>
                  <td>{result.train_name}</td>
                  <td>{result.seats}</td>
                  <td>{result.filled}</td>
                  <td>{result.station}</td>
                  <td>{result.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="registration-container">
          <form className="form1-container2" onSubmit={submitForm}>
            <h1 className="logo1">
              Register Here...
            </h1>
            <div className="input-container1">
              <label className="input-label1" htmlFor="course_id">
                User_Id
              </label>
              <input
                type="text"
                id="course_id"
                value={user_id}
                className="username-input-field1"
                readOnly
              />
            </div>
            <div className="input-container1">
              <label className="input-label1" htmlFor="course_name">
                Train_Id
              </label>
              <input
                type="text"
                id="course_name"
                value={train_id}
                className="username-input-field1"
                onChange={onChangeTrainId}
              />
            </div>
            <div className="input-container1">
              <label className="input-label1" htmlFor="user_name">
                Train_Name
              </label>
              <input
                type="text"
                id="user_name"
                value={train_name}
                className="username-input-field1"
                onChange={onChangeTrainName}
              />
            </div>
            <button type="submit" className="submit-button1">
              Submit
            </button>
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </form>
          
        </div>
       
      </div>
      
    
    <Footer/>
      </div>
  );
}

export default Home;
