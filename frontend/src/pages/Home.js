import { useState, useEffect } from "react";
import useAuthFetch from "../hooks/useAuthFetch";

const Home = () => {
  const [username, setUserName] = useState("");
  const {
    data: expenses,
    isLoading: expensesLoading,
    error: expensesError, // Fixed variable name
  } = useAuthFetch("http://localhost:5000/api/expenses");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Handle loading state
  if (expensesLoading) {
    return (
      <div className="content">
        <h2>Loading...</h2>
      </div>
    );
  }

  // Handle error state
  if (expensesError) {
    return (
      <div className="content">
        <h2>Error loading expenses</h2>
        <p>{expensesError.message}</p>
      </div>
    );
  }

  // Ensure expenses is an array before mapping
  const expensesList = Array.isArray(expenses) ? expenses : [];

  return (
    <div className="content">
      {username && <h2>{username}'s Visual Wallet:</h2>}
      {!username && <h2>My Expenses:</h2>}
      {expensesList.length === 0 ? (
        <div className="no-expenses">
          <div className="no-expenses-icon">💸</div>
          <h3>No expenses yet</h3>
          <p>Start tracking your expenses to see them here</p>
        </div>
      ) : (
        expensesList.map((expense) => (
          <div className={`expense-item`} key={expense.id}>
            <div className="expense-header">
              <h3 className="expense-name">
                {expense.name || "Untitled Expense"}
              </h3>
              <p className="expense-amount">{expense.amount}</p>
            </div>

            <div className="expense-details">
              <span
                className={`expense-category ${
                  expense.category?.toLowerCase() || "general"
                }`}
              >
                {expense.category || "General"}
              </span>
              <span className="expense-date">
                {expense.created_on
                  ? new Date(expense.created_on).toLocaleDateString()
                  : "No date"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
