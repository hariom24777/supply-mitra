import { Link } from "react-router-dom";

const VendorNavbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Supply Mitra</h1>
      <div className="space-x-4">
        <Link to="/vendor/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/vendor/suppliers" className="hover:underline">Suppliers</Link>
        <Link to="/vendor/cart" className="hover:underline">Cart</Link>
        <Link to="/vendor/orders" className="hover:underline">Orders</Link>
        <Link to="/vendor/settings" className="hover:underline">Settings</Link>
      </div>
    </nav>
  );
};

export default VendorNavbar;
