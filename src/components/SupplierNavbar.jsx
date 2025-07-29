import { useState, useEffect } from "react";
import { HiUsers } from "react-icons/hi";
import { IoCart, IoClose, IoCube, IoHome, IoMenu, IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";

const SupplierNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/supplier/dashboard", icon: <IoHome />, label: "Dashboard" },
    { to: "/supplier/products", icon: <IoCube />, label: "Products" },
    { to: "/supplier/orders", icon: <IoCart />, label: "Orders" },
    { to: "/supplier/vendors", icon: <HiUsers />, label: "Vendors" },
    { to: "/supplier/settings", icon: <IoSettings />, label: "Settings" },
  ];

  // Lock scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  return (
    <>
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center md:px-8">
        <h1 className="text-xl font-bold">Supply Mitra</h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:underline transition duration-200"
            >
              <span className="inline-flex items-center space-x-2">
                {link.icon}
                <span>{link.label}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
        </button>
      </nav>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/90 backdrop-filter backdrop-blur-md bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 space-y-5 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-600">
            <IoClose className="text-2xl" />
          </button>
        </div>

        {links.map((link) => (
          <Link
            key={link.to}
            
            to={link.to}
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 text-base hover:text-blue-600 transition duration-200"
          >
            <span className="text-xl inline-flex items-center space-x-2">
              {link.icon}
              <span className="">{link.label}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SupplierNavbar;
