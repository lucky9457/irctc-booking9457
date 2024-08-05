import React, { useContext, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './login.css';



const LoginForm = () => {
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
 
  const navigate = useNavigate();

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    Cookies.set('user_name', user_name, { expires: 30 });
    Cookies.set('password', password, {expires:30});
   
    navigate("/"); 
  };

  

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { user_name, password };
    const apiUrl = 'http://localhost:4001/login/';
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    if (response.ok) {
      
      console.log(data.jwtToken);
      onSubmitSuccess(data.jwtToken);
    } else {
      console.log("err");
      setShowSubmitError(true);
      setErrorMsg("Invalid Credentials");
      setPassword("");
      setUsername("");
    }
  };

  const token = Cookies.get('jwt_token');
  if (token !== undefined) {
    navigate("/");
  }

  return (
    <div className="login-container1">
      
      <form className="form-container1" onSubmit={submitForm}>
       
         <h1 className='logo1'>Booking <span className='logo2'>Platform</span></h1>
        <div className="input-container">
          <label className="input-label1" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            value={user_name}
            className="username-input-field1"
            onChange={onChangeUsername}
            placeholder="Username"
          />
        </div>
        <div className="input-container">
          <label className="input-label1" htmlFor="password">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            value={password}
            className="username-input-field1"
            onChange={onChangePassword}
            placeholder="Password"
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>

        {showSubmitError && <p className="error-message1">*{errorMsg}</p>}
        <div className="signup-link-container">
          <p className="sign-link-text1">
            Dont have an account?{" "}
            <Link to="/signUp" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
