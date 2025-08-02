import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { HiMinus, HiPlus } from "react-icons/hi";

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchSuppliers = async () => {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      const productList = [];

      querySnapshot.forEach((docSnap) => {
        const supplier = docSnap.data();
        const supplierId = docSnap.id;
        supplier.products?.forEach((product, index) => {
          productList.push({
            ...product,
            supplierName: supplier.name,
            supplierCity: supplier.city,
            key: `${supplierId}-${index}`,
          });
        });
      });

      setProducts(productList);
    };
    fetchSuppliers();
  }, []);

  const handleQty = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) + delta),
    }));
  };

  const addToCart = async (product) => {
    const qty = quantities[product.key] || 1;
    try {
      const user = auth.currentUser;
      if (!user) return alert("Login required to add to cart");

      const cartRef = doc(db, "carts", user.uid);
      await setDoc(
        cartRef,
        {
          items: arrayUnion({
            ...product,
            quantity: qty,
            timestamp: Date.now(),
          }),
        },
        { merge: true }
      );

      setCart((prev) => ({
        ...prev,
        [product.key]: (prev[product.key] || 0) + qty,
      }));
      alert("Added to cart!");
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const filteredProducts = products.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search) ||
      p.supplierName?.toLowerCase().includes(search) ||
      p.supplierCity?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <input
          type="text"
          placeholder="Search products, suppliers, or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 rounded-lg w-full md:w-1/2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.key} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-4 mb-3">
              <img
                src={product.img}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-full border border-gray-100"
              />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.desc}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              Supplier:{" "}
              <span className="font-medium">{product.supplierName}</span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              City: {product.supplierCity}
            </p>

            <div className="text-green-600 font-semibold mb-3">
              ₹{product.price}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQty(product.key, -1)}
                  className="w-6 h-8 flex items-center justify-center bg-gray-200 border border-gray-300 hover:border-blue-600 rounded cursor-pointer"
                >
                  <HiMinus className="text-sm"/>
                </button>
                <span>{quantities[product.key] || 1}</span>
                <button
                  onClick={() => handleQty(product.key, 1)}
                  className="w-6 h-8 flex items-center justify-center bg-gray-200 border border-gray-300 hover:border-blue-600 rounded cursor-pointer"
                >
                  <HiPlus className="text-sm"/>
                </button>
              </div>

              <button
                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded cursor-pointer"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;
