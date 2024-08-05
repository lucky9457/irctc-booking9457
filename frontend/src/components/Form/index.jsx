import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import CartContext from "../../context/CartContext";
import Cookies from 'js-cookie';

import "./index.css";

const Form = ({ details }) => {
  // const [user_name, setName] = useState("");
  const [user_id, setId] = useState();
  const [train_id, setTrainId] = useState();
  const [train_name, setTrainName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");








  const navigate = useNavigate();


  const onChangeId = (event) => {
    setId(event.target.value);
  };
  const onChangeTrainId = (event) => {
    setTrainId(event.target.value);
  };
  const onChangeTrainName = (event) => {
    setTrainName(event.target.value);
  };

  const submitForm = async (event) => {
    event.preventDefault();



    const userDetails = { user_id, train_id, train_name };
    const url = "http://localhost:4001/booking/";
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        alert("registration successfull...");
        setId("");
        setTrainId("");
        setTrainName("");




      } else {
        alert("already job applied...");

      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div className="orders-container">
      <form className="form1-container1" onSubmit={submitForm}>
        <h1 className='logo1'>Job <span className='logo2'>Hub</span></h1>
        <div className="input-container1">
          <label className="input-label1" htmlFor="course_id">
            ID
          </label>
          <input
            type="text"
            id="course_id"
            value={id}
            className="username-input-field"
            readOnly
          />
        </div>
        <div className="input-container1">
          <label className="input-label1" htmlFor="course_name">
            JOB_NAME
          </label>
          <input
            type="text"
            id="course_name"
            value={job_name}
            className="username-input-field"
            readOnly
          />
        </div>
        <div className="input-container1">
          <label className="input-label1" htmlFor="user_name">
            USER_NAME
          </label>
          <input
            type="text"
            id="user_name"
            value={user_name}
            className="username-input-field"
          // onChange={onChangeUsername}
          />
        </div>
        <div className="input-container1">
          <label className="input-label1" htmlFor="amount">
            PHONE_NUMBER
          </label>
          <input
            type="text"
            id="amount"
            value={ph_no}
            className="password-input-field"
            onChange={onChangePhno}
            placeholder="phone number"
          />
        </div>
        <div className="input-container1">
          <label className="input-label1" htmlFor="amount">
            EMAIL
          </label>
          <input
            type="email"
            id="amount"
            value={email}
            className="password-input-field"
            onChange={onChangeEmail}
            placeholder="email"
          />
        </div>
        <button type="submit" className="login-button1">
          Submit
        </button>

        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>

    </div>
  );
};

export default Form;
