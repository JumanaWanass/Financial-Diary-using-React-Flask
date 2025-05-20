import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="title">
        Where's My Money
      </Link>

      <ul className="">
        <li>
          <NavLink to="/MYaccount">My Account</NavLink>
        </li>
        <li>
          <NavLink to="/addexpense">Add Expense</NavLink>
        </li>
      </ul>
    </nav>
  );
};
