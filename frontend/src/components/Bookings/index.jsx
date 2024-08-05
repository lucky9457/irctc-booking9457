import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../Navbar';
import './bookings.css';


function Bookings() {
  const [bookings, setBookings] = useState([]);
  const user_id = Cookies.get("user_id");
  const token = Cookies.get("jwt_token");
  
  console.log(token);

  useEffect(() => {
    const calling = async () => {
      const url = "http://localhost:4001/bookingDetails/";
      const options = {
        method: "POST",
        headers: {
          "Authorization": `bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      };

      try {
        const response = await fetch(url, options);

        if (response.ok) {
          const data = await response.json(); 
          console.log("bookings added:", data);
          setBookings(data);
        } else {
          console.log("Error adding bookings:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    calling();
  }, [token]);

  return (
    <div className='course-container'>
    <Navbar/>
      <h1>Your Bookings...</h1>
      <marquee>🏃‍♂️🏃‍♂️...Train-Booking-platform..,🏃‍♂️🏃‍♂️</marquee>
      <div className='cards'>
        {bookings.length > 0 ? (
          <table className='bookings-table'>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>Train ID</th>
                <th>Train Name</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((book, index) => (
                <tr key={index}>
                  <td>{book.booking_id}</td>
                  <td>{book.user_id}</td>
                  <td>{book.train_id}</td>
                  <td>{book.train_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default Bookings;
