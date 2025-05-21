import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AddExpense = () => {
  const navigate = useNavigate();
  const [expense_name, setExpenseName] = useState("");
  const [category, setCategory] = useState("");
  const [created_on, setCreatedOn] = useState("");
  const [amount, setAmount] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expense_name, category, amount, created_on }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add expense");
      }

      alert("Expense added successfully");
      setExpenseName("");
      setCategory("");
      setCreatedOn("");
      setAmount("");

      navigate("/");
    } catch (error) {
      console.error("Error adding expense:", error);

      alert(`Error: ${error.message}`);

      if (
        error.message.includes("unauthorized") ||
        error.message.includes("token")
      ) {
        setIsAuthenticated(false);
      }
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title_para">You're poor. Stop spending.</h2>

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group expense-name with-icon">
            <label htmlFor="expense-name">Expense Name</label>
            <input
              id="expense-name"
              type="text"
              placeholder="What did you spend on?"
              required
              value={expense_name}
              onChange={(e) => setExpenseName(e.target.value)}
            />
          </div>

          <div className="form-group expense-category with-icon">
            <label htmlFor="expense-category">Category</label>
            <select
              id="expense-category"
              className="category-select"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="coffee">☕ Coffee Addiction</option>
              <option value="food">🍔 Food & Dining</option>
              <option value="hania">👩🏻 Hania</option>
              <option value="transport">🚗 Transportation</option>
              <option value="entertainment">🎬 Entertainment</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="coworkingspace">⚡ Coworking Space</option>
              <option value="healthcare">🏥 Healthcare</option>
              <option value="education">📚 Education</option>
              <option value="other">📦 Other</option>
            </select>
          </div>

          <div className="form-group expense-amount with-icon">
            <label htmlFor="expense-amount">Amount</label>
            <div className="amount-input">
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group expense-date with-icon">
            <label htmlFor="expense-date">Date</label>
            <input
              id="expense-date"
              type="date"
              required
              value={created_on}
              onChange={(e) => setCreatedOn(e.target.value)}
            />
          </div>

          <div className="form-group submit-button">
            <input type="submit" value="Add Expense" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
