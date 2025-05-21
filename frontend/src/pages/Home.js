import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthFetch from "../hooks/useAuthFetch";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const {
    data: expenses,
    isLoading: expensesLoading,
    error: expensesError,
  } = useAuthFetch("http://localhost:5000/api/expenses");

  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate("/login");
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }

        const userData = await response.json();
        setUserName(userData.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [navigate, setIsAuthenticated]);

  // Calculate totals when expenses data changes
  useEffect(() => {
    if (expenses) {
      let incomeTotal = 0;
      let expenseTotal = 0;
      const transactionList = [];

      const expensesList = Array.isArray(expenses) ? expenses : [];

      expensesList.forEach((item) => {
        if (item.type === "income") {
          incomeTotal += parseFloat(item.amount || 0);
        } else {
          expenseTotal += parseFloat(item.amount || 0);
        }

        // Parse the date - handle different date formats
        let transactionDate;
        if (item.created_on) {
          // Try to parse the date from the created_on field
          transactionDate = new Date(item.created_on);
          // If the date is invalid, try different format or set to current date
          if (isNaN(transactionDate.getTime())) {
            // Try DD/MM/YYYY format
            const parts = item.created_on.split("/");
            if (parts.length === 3) {
              transactionDate = new Date(parts[2], parts[1] - 1, parts[0]);
            } else {
              transactionDate = new Date(); // Fallback to current date
            }
          }
        } else {
          transactionDate = new Date(); // Default to current date if no date provided
        }

        transactionList.push({
          id: item._id || item.id,
          name: item.description || item.name || item.expense_name || "Untitled",
          amount: item.amount || 0,
          type: item.type || "expense",
          category: item.category || "Other",
          rawDate: transactionDate, // Store raw date for sorting
          date: transactionDate.toLocaleDateString(),
        });
      });

      // Sort transactions by date (most recent first)
      transactionList.sort((a, b) => b.rawDate - a.rawDate);

      setTotalIncome(incomeTotal.toFixed(2));
      setTotalExpense(expenseTotal.toFixed(2));
      setBalance((incomeTotal - expenseTotal).toFixed(2));
      setTransactions(transactionList);
    }
  }, [expenses]);

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
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>{userName ? `${userName}'s Dashboard` : "Dashboard"}</h1>
          <div className="flex gap-2">
            <Link to="/add-income" className="btn btn-primary">
              Add Income
            </Link>
            <Link to="/addexpense" className="btn btn-outline">
              Add Expense
            </Link>
          </div>
        </div>

        <div className="balance-card">
          <p className="balance-title">Current Balance</p>
          <h2 className="balance-amount">${balance}</h2>
          <p>Updated {new Date().toLocaleDateString()}</p>
        </div>

        <div className="summary-cards">
          <div className="summary-card income">
            <div className="card-title">
              <span>Total Income</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <p className="card-amount income-amount">${totalIncome}</p>
          </div>

          <div className="summary-card expense">
            <div className="card-title">
              <span>Total Expenses</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 5l9 14H3l9-14zm0 0v10" />
              </svg>
            </div>
            <p className="card-amount expense-amount">${totalExpense}</p>
          </div>
        </div>

        <div className="transactions-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/all-transactions" className="btn btn-outline">
              View All
            </Link>
          </div>

          <div className="transactions-list">
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-icon">
                      {transaction.type === "income" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 5l9 14H3l9-14zm0 0v10" />
                        </svg>
                      )}
                    </div>
                    <div className="transaction-details">
                      <span className="transaction-name">
                        {transaction.name}
                      </span>
                      <div className="transaction-metadata">
                        {transaction.type !== "income" && (
                          <span
                            className={`transaction-category ${transaction.category?.toLowerCase()}`}
                          >
                            {transaction.category}
                          </span>
                        )}
                        <span className="transaction-date">
                          {transaction.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center p-4">No transactions found</p>
            )}
          </div>

          {transactions.length === 0 && (
            <div className="text-center mt-4">
              <p className="mb-4">Start by adding your first transaction</p>
              <div className="flex justify-between gap-2 w-full max-w-md mx-auto">
                <Link to="/add-income" className="btn btn-primary w-full">
                  Add Income
                </Link>
                <Link to="/addexpense" className="btn btn-outline w-full">
                  Add Expense
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
