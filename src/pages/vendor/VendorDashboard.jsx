import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";

const VendorDashboard = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [location, setLocation] = useState("All Locations");
  const [category, setCategory] = useState("All Categories");
  const [cart, setCart] = useState({});
  const [quantities, setQuantities] = useState({});

  // Fetch suppliers from Firestore
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "suppliers"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleQty = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) + delta),
    }));
  };

  const addToCart = async (supplierIdx, prodIdx) => {
    const supplier = suppliers[supplierIdx];
    const product = supplier.products[prodIdx];
    const key = `${supplierIdx}-${prodIdx}`;
    const qty = quantities[key] || 1;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Login required to add to cart");
        return;
      }

      const cartRef = doc(db, "carts", user.uid);
      await setDoc(
        cartRef,
        {
          items: arrayUnion({
            ...product,
            supplierName: supplier.name,
            quantity: qty,
            timestamp: Date.now(),
          }),
        },
        { merge: true }
      );

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

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        {suppliers
          .filter((s) =>
            location === "All Locations" ? true : s.city === location
          )
          .map((supplier, si) => (
            <div key={supplier.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <span className="text-lg font-semibold mr-2">
                  {supplier.name}
                </span>
                <span className="text-gray-500 text-sm">| {supplier.city}</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700 mb-2">
                  Products
                </span>
                {supplier.products?.length > 0 ? (
                  supplier.products
                    .filter((prod) =>
                      category === "All Categories"
                        ? true
                        : prod.category === category
                    )
                    .map((prod, pi) => {
                      const key = `${si}-${pi}`;
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
                              <div className="text-xs text-gray-500">
                                {prod.desc}
                              </div>
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
                              <span className="mx-2">
                                {quantities[key] || 1}
                              </span>
                              <button
                                onClick={() => handleQty(key, 1)}
                                className="px-2 py-1 bg-gray-200 rounded"
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="bg-blue-600 text-white px-2 py-1 rounded"
                              onClick={() => addToCart(si, pi)}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-gray-500 text-sm mt-2">
                    No products listed.
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VendorDashboard;
