import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);
  const logInUser = async (e) => {
    e.preventDefault();
    console.log(username, password);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      setIsAuthenticated(true);
      navigate("/");
      console.log("Login successful!");
    } catch (error) {
      alert("Invalid credentials");
    }
  };
  return (
    <div className="container">
      <div className="wrapper">
        <div className="title">
          <span>Welcome back</span>
        </div>
        <p className="title_para">Please enter your details to sign in.</p>

        <form onSubmit={logInUser}>
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
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="row button">
            <input type="submit" value="Login" />
          </div>
          <div className="signup-link">
            Not a member? <a href="/Register">Signup now</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
