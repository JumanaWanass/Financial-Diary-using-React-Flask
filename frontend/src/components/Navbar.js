import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <span>Where's My Money</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/addexpense"
            className={`nav-link ${
              location.pathname === "/addexpense" ? "active" : ""
            }`}
          >
            Add Expense
          </Link>
          <Link
            to="/add-income"
            className={`nav-link ${
              location.pathname === "/add-income" ? "active" : ""
            }`}
          >
            Add Income
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
