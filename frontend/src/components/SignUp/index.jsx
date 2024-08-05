import React from "react";
import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
 import "./signup.css";

const LoginForm = () => {
  const [user_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ph_no, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onChangeUsername = (event) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangePhone = (event) => {
    setPhone(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const submitForm = async (event) => {
    event.preventDefault();


     if (ph_no.length !== 10) {
      setShowSubmitError(true);
      setErrorMsg("Phone number must be 10 digits");
      return; // Don't proceed with form submission
    }

    const userDetails = { user_name, email,ph_no, password };
    const url = "http://localhost:4001/register/";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(url, options);
    // console.log(response);
    if (response.ok) {
      console.log(response);
      console.log("navigated");
      const data = await response.json();
      Cookies.set("user_id", data);
      navigate("/login");
    } else {
      setShowSubmitError(true);
      setErrorMsg("Invalid Credentials");
    }
  };

  return (
    <div className="sign-container">
      <form className="form1-container" onSubmit={submitForm}>
        <h1 className="heading">👉..Booking_Platform...👈</h1>
        <div className="input-container">
          <label className="input-label" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            value={user_name}
            className="username-input-field"
            onChange={onChangeUsername}
            placeholder="Username"
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="email">
            EMAIL
          </label>
          <input
            type="text"
            id="email"
            value={email}
            className="username-input-field"
            onChange={onChangeEmail}
            placeholder="Email"
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="phone">
            PHONE NO
          </label>
          <input
            type="text"
            id="phone"
            value={ph_no}
            className="username-input-field"
            onChange={onChangePhone}
            placeholder="Phone"
          />
        </div>
        
        <div className="input-container">
          <label className="input-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            value={password}
            className="password-input-field"
            onChange={onChangePassword}
            placeholder="Password"
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>

        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <div className="signup-link-container">
        <p className="sign-link-text">
          Already have an account?{" "}
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </p>
      </div>
      </form>
      
    </div>
  );
};

export default LoginForm;
