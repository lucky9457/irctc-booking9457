import { Link, useNavigate} from 'react-router-dom';
import React from 'react';
import Cookies from 'js-cookie';
import './nav.css';
function Navbar() {
  
  const navigate = useNavigate();
  
  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    Cookies.remove("user_name");
    Cookies.remove("user_id");
    navigate('/login');
  };
  return (
    <nav className='container'>
      <ul className='align'>
        <li className='item'><Link to="/">Home</Link></li>
        <li className='item'><Link to="/bookings">My Bookings</Link></li>
        <li className='item'><Link to="/login">Sign Up</Link></li>
       
        <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
      </ul>
    </nav>
  );
}

export default Navbar;
