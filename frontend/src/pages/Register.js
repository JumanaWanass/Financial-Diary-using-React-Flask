import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);
  const handleRegistration = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, Name, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      setIsAuthenticated(true);
      navigate("/login");
      console.log("Login successful!");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title">
          <span>Welcome aboard!</span>
        </div>
        <p className="title_para">Please enter your details to sign up.</p>

        <form onSubmit={handleRegistration}>
          <div className="row">
            <input
              type="text"
              placeholder="Enter your username..."
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="row">
            <input
              type="text"
              placeholder="Enter your name..."
              required
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="row">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="row button">
            <input type="submit" value="Register Now" />
          </div>
          <div className="signup-link">
            Already a member? <a href="/login">Login now</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
