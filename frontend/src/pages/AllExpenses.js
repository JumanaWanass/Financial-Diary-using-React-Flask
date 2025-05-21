import React, { useState, useEffect } from "react";
import useAuthFetch from "../hooks/useAuthFetch";

const AllExpenses = () => {
  const {
    data: expenses,
    isLoading: expensesLoading,
    error: expensesError,
  } = useAuthFetch("http://localhost:5000/api/expenses");

  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [filterType, setFilterType] = useState("all"); // all, income, expense
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc", // Default to newest first
  });

  // Process expenses data when it changes
  useEffect(() => {
    if (expenses) {
      const expensesList = Array.isArray(expenses) ? expenses : [];

      const transactionList = expensesList.map((item) => ({
        id: item._id || item.id,
        name: item.description || item.name || item.expense_name || "Untitled",
        amount: parseFloat(item.amount || 0),
        type: item.type || "expense",
        category: item.category || "Other",
        rawDate: item.created_on ? new Date(item.created_on) : new Date(),
        date: item.created_on
          ? new Date(item.created_on).toLocaleDateString()
          : new Date().toLocaleDateString(),
      }));

      setTransactions(transactionList);
    }
  }, [expenses]);

  // Sorting logic
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted and filtered transactions
  const getSortedTransactions = () => {
    let sortableTransactions = [...transactions];

    // Filter by type if needed
    if (filterType !== "all") {
      sortableTransactions = sortableTransactions.filter(
        (t) => t.type === filterType
      );
    }

    // Sort the transactions
    sortableTransactions.sort((a, b) => {
      if (sortConfig.key === "date") {
        // Sort by date
        if (a.rawDate < b.rawDate) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a.rawDate > b.rawDate) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      } else if (sortConfig.key === "amount") {
        // Sort by amount
        if (a.amount < b.amount) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a.amount > b.amount) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      }
      return 0;
    });

    return sortableTransactions;
  };

  const sortedAndFilteredTransactions = getSortedTransactions();

  // Paginate the sorted and filtered transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedAndFilteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter change
  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (expensesLoading) {
    return (
      <div className="content">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (expensesError) {
    return (
      <div className="content">
        <h2>Error loading transactions</h2>
        <p>{expensesError.message}</p>
      </div>
    );
  }

  return (
    <div className="container all-transactions">
      <div className="all-transactions-header">
        <h1>All Transactions</h1>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`filter-btn income ${
              filterType === "income" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("income")}
          >
            Income
          </button>
          <button
            className={`filter-btn expense ${
              filterType === "expense" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("expense")}
          >
            Expenses
          </button>
        </div>
      </div>

      <div className="sorting-controls">
        <span>Sort by:</span>
        <button
          className={`sort-btn ${sortConfig.key === "date" ? "active" : ""}`}
          onClick={() => requestSort("date")}
        >
          Date
          {sortConfig.key === "date" && (
            <span className="sort-direction">
              {sortConfig.direction === "asc" ? " ↑" : " ↓"}
            </span>
          )}
        </button>
        <button
          className={`sort-btn ${sortConfig.key === "amount" ? "active" : ""}`}
          onClick={() => requestSort("amount")}
        >
          Amount
          {sortConfig.key === "amount" && (
            <span className="sort-direction">
              {sortConfig.direction === "asc" ? " ↑" : " ↓"}
            </span>
          )}
        </button>
      </div>

      <div className="transactions-list">
        {currentTransactions.length > 0 ? (
          currentTransactions.map((transaction) => (
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
                  <span className="transaction-name">{transaction.name}</span>
                  <div className="transaction-metadata">
                    {transaction.type !== "income" && (
                      <span
                        className={`transaction-category ${transaction.category?.toLowerCase()}`}
                      >
                        {transaction.category}
                      </span>
                    )}
                    <span className="transaction-date">{transaction.date}</span>
                  </div>
                </div>
              </div>
              <span className={`transaction-amount ${transaction.type}`}>
                {transaction.type === "income" ? "+" : "-"}$
                {transaction.amount.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center p-4">No transactions found</p>
        )}
      </div>

      {sortedAndFilteredTransactions.length > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({
            length: Math.ceil(
              sortedAndFilteredTransactions.length / transactionsPerPage
            ),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`pagination-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(
                sortedAndFilteredTransactions.length / transactionsPerPage
              )
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllExpenses;
