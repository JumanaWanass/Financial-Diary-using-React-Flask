import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import AddExpense from "./pages/AddExpense";
import { ProtectedRoute } from "./components/ProtectedRoute";
import MyAccount from "./pages/MyAccount";
import AllExpenses from "./pages/AllExpenses"; // Import the new component
import MyIncome from "./pages/MyIncome";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>

            <Route
              path="/addexpense"
              element={
                <ProtectedRoute>
                  <AddExpense />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/all-transactions"
              element={
                <ProtectedRoute>
                  <AllExpenses />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/myaccount"
              element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/myincome"
              element={
                <ProtectedRoute>
                  <MyIncome />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
