import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../../firebase/config"; // Adjust path

const VendorDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [location, setLocation] = useState("All Locations");
  const [category, setCategory] = useState("All Categories");
  const [cart, setCart] = useState({});
  const [quantities, setQuantities] = useState({});

  // Fetch vendors from Firestore
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vendors"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const handleQty = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) + delta),
    }));
  };

  const addToCart = async (vendorIdx, prodIdx) => {
    const vendor = vendors[vendorIdx];
    const product = vendor.products[prodIdx];
    const key = `${vendorIdx}-${prodIdx}`;
    const qty = quantities[key] || 1;

    // Store in Firestore (under user cart)
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Login required to add to cart");
        return;
      }

      const cartRef = doc(db, "carts", user.uid);
      await updateDoc(cartRef, {
        items: arrayUnion({
          ...product,
          vendorName: vendor.name,
          quantity: qty,
          timestamp: Date.now(),
        }),
      });

      setCart((prev) => ({
        ...prev,
        [key]: (prev[key] || 0) + qty,
      }));
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-2xl">Vendor Dashboard</h1>
      </div>

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
        {vendors
          .filter((v) =>
            location === "All Locations" ? true : v.city === location
          )
          .map((vendor, vi) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <span className="text-lg font-semibold mr-2">{vendor.name}</span>
                <span className="text-gray-500 text-sm">| {vendor.city}</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700 mb-2">
                  Products
                </span>
                {vendor.products?.map((prod, pi) => {
                  const key = `${vi}-${pi}`;
                  return (
                    <div
                      key={prod.name + pi}
                      className="flex items-center justify-between bg-blue-50 rounded-lg mt-3 p-3"
                    >
                      <div className="flex items-center">
                        <img
                          className="w-14 h-14 object-cover rounded mr-3"
                          src={prod.img}
                          alt={prod.name}
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

export default VendorDashboard;
