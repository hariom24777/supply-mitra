import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import VendorLogin from "./pages/vendor/Login";
import VendorDashboard from "./pages/vendor/Dashboard";
import SupplierLogin from "./pages/supplier/Login";
import SupplierDashboard from "./pages/supplier/Dashboard";
import Suppliers from "./pages/vendor/Suppliers";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/suppliers"
          element={
            <ProtectedRoute>
              <Suppliers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
