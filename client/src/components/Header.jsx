import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from './icc.jpg';
import './header.css';


function Header() {
  const kp = window.localStorage.getItem('loggedIn');
  console.log(kp);

  const logout = () => {
    window.localStorage.clear();
    window.location.href = './';
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img
          src={logo}
          alt="ReactJS"
          className="logo-image"
        />
        Book Hives
      </Link>
      <nav className="nav">
        <div>
          
          <div>
            {kp ? (
         <div className="nav-group">
  <NavLink to="/books">Books</NavLink>
  <NavLink to="/teachers">Teachers</NavLink>
  <NavLink to="/recommendations">Recommendation</NavLink>
  <NavLink to="/popular">Popular</NavLink>
  <NavLink to="/userDetails">Admin</NavLink>
  <NavLink to="/mybookdetails">Details</NavLink>
  <NavLink to="/userChats">Chats</NavLink>
  
  {/* Move logout button here */}
  <button className="logout-button" onClick={logout}>
    Log Out
  </button>
</div>


            ) : (
              <NavLink to="/Signup" className="navregister">Register</NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
