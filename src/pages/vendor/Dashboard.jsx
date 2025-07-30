import React, { useState } from "react";
import CartSidebar from "../../components/CartSidebar";
// adjust the path if needed

// Sample vendor/product data
const vendorData = [
  {
    name: "TechWorld Suppliers",
    city: "Delhi",
    products: [
      {
        name: "Wireless Headphones",
        desc: "Premium quality wireless headphones with noise cancellation",
        price: 2999,
        img: "https://img.icons8.com/ios-filled/100/000000/headphones.png",
      },
      {
        name: "Smartphone Case",
        desc: "Durable protective case for smartphones",
        price: 599,
        img: "https://img.icons8.com/ios-filled/100/000000/smartphone-tablet.png",
      },
    ],
  },
  {
    name: "Fashion Hub",
    city: "Mumbai",
    products: [
      {
        name: "Cotton T-Shirt",
        desc: "Comfortable cotton t-shirt in various colors",
        price: 799,
        img: "https://img.icons8.com/ios-filled/100/000000/t-shirt.png",
      },
      {
        name: "Denim Jeans",
        desc: "Classic blue denim jeans with modern fit",
        price: 1899,
        img: "https://img.icons8.com/ios-filled/100/000000/jeans.png",
      },
    ],
  },
  {
    name: "Fresh Foods Co.",
    city: "Bangalore",
    products: [
      {
        name: "Organic Apples",
        desc: "Fresh organic apples from local farms",
        price: 299,
        img: "https://img.icons8.com/ios-filled/100/000000/apple.png",
      },
      {
        name: "Green Tea",
        desc: "Premium green tea leaves in sealed packaging",
        price: 449,
        img: "https://img.icons8.com/ios-filled/100/000000/tea.png",
      },
    ],
  },
  {
    name: "Fresh Foods Co.",
    city: "Bangalore",
    products: [
      {
        name: "Organic Apples",
        desc: "Fresh organic apples from local farms",
        price: 299,
        img: "https://img.icons8.com/ios-filled/100/000000/apple.png",
      },
      {
        name: "Green Tea",
        desc: "Premium green tea leaves in sealed packaging",
        price: 449,
        img: "https://img.icons8.com/ios-filled/100/000000/tea.png",
      },
    ],
  },
  {
    name: "Fresh Foods Co.",
    city: "Bangalore",
    products: [
      {
        name: "Organic Apples",
        desc: "Fresh organic apples from local farms",
        price: 299,
        img: "https://img.icons8.com/ios-filled/100/000000/apple.png",
      },
      {
        name: "Green Tea",
        desc: "Premium green tea leaves in sealed packaging",
        price: 449,
        img: "https://img.icons8.com/ios-filled/100/000000/tea.png",
      },
    ],
  },
];

const Dashboard = () => {
  const [location, setLocation] = useState("All Locations");
  const [category, setCategory] = useState("All Categories");
  const [city, setCity] = useState("Kolkata");
  const [cart, setCart] = useState({});
  const [quantities, setQuantities] = useState({});

  const [showCart, setShowCart] = useState(false);

  const handleQty = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) + delta),
    }));
  };

  const addToCart = (vendorIdx, prodIdx) => {
    const key = `${vendorIdx}-${prodIdx}`;
    const qty = quantities[key] || 1;
    setCart((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + qty,
    }));
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-2xl">VendorHub</h1>
        </div>
        <div className="flex space-x-3 items-center">
          <select
            className="border px-3 py-1 rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option>Kolkata</option>
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
          </select>
          <button className="relative" onClick={() => setShowCart(true)}>
            <svg width="24" height="24" fill="none" className="text-gray-800">
              <path
                d="M6 6h15l-1.35 9.14A2 2 0 0 1 17.7 17H9.3a2 2 0 0 1-1.95-1.59L5 2H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="10" cy="21" r="1" stroke="currentColor" />
              <circle cx="17" cy="21" r="1" stroke="currentColor" />
            </svg>
            <span className="absolute -top-2 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.keys(cart).length}
            </span>
          </button>
          <button className="relative"></button>
        </div>
      </div>

      <CartSidebar
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        vendorData={vendorData}
      />

      {/* Filters */}
      <div className="flex space-x-4 mb-8">
        <div>
          <span className="mr-1">Location:</span>
          <select
            className="border px-2 py-1 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option>All Locations</option>
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
          </select>
        </div>
        <div>
          <span className="mr-1">Category:</span>
          <select
            className="border px-2 py-1 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Groceries</option>
          </select>
        </div>
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        {vendorData.map((vendor, vi) => (
          <div key={vendor.name} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-2">
              <span className="text-lg font-semibold mr-2">{vendor.name}</span>
              <span className="text-gray-500 text-sm">| {vendor.city}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700 mb-2">
                Products
              </span>
              {vendor.products.map((prod, pi) => {
                const key = `${vi}-${pi}`;
                return (
                  <div
                    key={prod.name}
                    className="flex items-center justify-between bg-gray-100 rounded-lg mt-3 p-3"
                  >
                    <div className="flex items-center">
                      <img
                        className="w-14 h-14 object-cover rounded mr-3"
                        src={prod.img}
                        alt=""
                      />
                      <div>
                        <div className="font-medium">{prod.name}</div>
                        <div className="text-xs text-gray-500">{prod.desc}</div>
                        <div className="text-green-600 font-semibold mt-1">
                          ₹{prod.price}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center mb-1">
                        <button
                          onClick={() => handleQty(key, -1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span className="mx-2">{quantities[key] || 1}</span>
                        <button
                          onClick={() => handleQty(key, 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                        onClick={() => addToCart(vi, pi)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
