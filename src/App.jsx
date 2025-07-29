import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorRegister from "./pages/vendor/VendorRegister";
import VendorDashboard from "./pages/vendor/Dashboard";
import SupplierLogin from "./pages/supplier/SupplierLogin";
import SupplierRegister from "./pages/supplier/SupplierRegister";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import Suppliers from "./pages/vendor/Suppliers";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import VendorNavbar from "./components/VendorNavbar";
import SupplierNavbar from "./components/SupplierNavbar";
import VendorProfile from "./pages/vendor/VendorProfile";
import SupplierProfileSetup from "./pages/supplier/SupplierProfileSetup";
import SupplierProfile from "./pages/supplier/SupplierProfile";
import Products from "./pages/supplier/Products";
import VendorListing from "./pages/supplier/VendorListing";
import VendorProfileSetup from "./pages/vendor/VendorProfileSetup";
import Cart from "./pages/vendor/Cart";
import VendorOrders from "./pages/vendor/VendorOrders";
import SupplierOrders from "./pages/supplier/SupplierOrders";

const AppRoutes = () => {
  const location = useLocation();
  const isVendor = location.pathname.startsWith("/vendor");
  const isSupplier = location.pathname.startsWith("/supplier");

  return (
    <>
      {/* Show appropriate Navbar based on role */}
      {isVendor &&
        !location.pathname.includes("login") &&
        !location.pathname.includes("register") && <VendorNavbar />}
      {isSupplier &&
        !location.pathname.includes("login") &&
        !location.pathname.includes("register") && <SupplierNavbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Vendor Routes */}
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />

        {/* Protected Vendor Routes */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/profile-setup"
          element={
            <ProtectedRoute>
              <VendorProfileSetup />
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
        <Route
          path="/vendor/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/orders"
          element={
            <ProtectedRoute>
              <VendorOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/settings"
          element={
            <ProtectedRoute>
              <VendorProfile />
            </ProtectedRoute>
          }
        />

        {/* Supplier Routes */}
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route path="/supplier/register" element={<SupplierRegister />} />
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/profile-setup"
          element={
            <ProtectedRoute>
              <SupplierProfileSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/orders"
          element={
            <ProtectedRoute>
              <SupplierOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/vendors"
          element={
            <ProtectedRoute>
              <VendorListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/settings"
          element={
            <ProtectedRoute>
              <SupplierProfile />
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
