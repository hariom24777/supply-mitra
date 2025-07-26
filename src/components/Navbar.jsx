import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">SupplyMitra</h1>
      <div className="space-x-4">
        <Link to="/vendor/login" className="hover:underline">Vendor</Link>
        <Link to="/supplier/login" className="hover:underline">Supplier</Link>
      </div>
    </nav>
  );
};

export default Navbar;
