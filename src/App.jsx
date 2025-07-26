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
  <>
  <SupplierDashboard/>

  </>
  );
}
