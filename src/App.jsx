import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import VendorLogin from "./pages/vendor/Login";
import VendorDashboard from "./pages/vendor/Dashboard";
import SupplierLogin from "./pages/supplier/Login";
import SupplierDashboard from "./pages/supplier/Dashboard";
import Suppliers from "./pages/vendor/Suppliers";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import VendorNavbar from "./components/VendorNavbar";
import SupplierNavbar from "./components/SupplierNavbar";

const AppRoutes = () => {
  const location = useLocation();
  const isVendor = location.pathname.startsWith("/vendor");
  const isSupplier = location.pathname.startsWith("/supplier");

  return (
    <>
      {/* Show appropriate Navbar based on role */}
      {isVendor && !location.pathname.includes("login") && <VendorNavbar />}
      {isSupplier && !location.pathname.includes("login") && <SupplierNavbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Vendor Routes */}
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute>
              <VendorDashboard />
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

        {/* Supplier Routes */}
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
