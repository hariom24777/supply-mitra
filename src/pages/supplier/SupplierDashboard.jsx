import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    customUnit: "",
  });

  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const supplierRef = doc(db, "suppliers", user.uid);

    const unsub = onSnapshot(supplierRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSupplier(data);
        setProducts(data.products || []);
      }
    });

    return () => unsub();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("Login required");

    const supplierRef = doc(db, "suppliers", user.uid);
    const unitToUse = form.unit === "other" ? form.customUnit : form.unit;

    const newProduct = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      unit: unitToUse,
    };

    try {
      await updateDoc(supplierRef, {
        products: arrayUnion(newProduct),
      });

      setForm({
        name: "",
        category: "",
        price: "",
        quantity: "",
        unit: "",
        customUnit: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Supplier Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage your products and orders
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Add Product */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
          <form className="space-y-4" onSubmit={handleAddProduct}>
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                required
              >
                <option value="">Select category</option>
                <option>Fresh Produce</option>
                <option>Grains & Pulses</option>
                <option>Spices and Seasonings</option>
                <option>Cooking Oil & Fats</option>
                <option>Beverages</option>
                <option>Packaging Materials</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Price per Unit
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                required
              >
                <option value="">Select unit</option>
                <option value="kg">per kg</option>
                <option value="litre">per litre</option>
                <option value="dozen">per dozen</option>
                <option value="piece">per piece</option>
                <option value="pack">per pack</option>
                <option value="other">Other</option>
              </select>
            </div>

            {form.unit === "other" && (
              <div>
                <label className="block text-sm font-medium">Custom Unit</label>
                <input
                  type="text"
                  name="customUnit"
                  value={form.customUnit}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="e.g., per tray, per sack"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">
                Available Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                placeholder="Enter quantity"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all duration-300 cursor-pointer"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Product Inventory */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Product Inventory</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <div className="space-y-4">
              {[...products]
                .slice(-4)
                .reverse()
                .map((product, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded px-4 py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.category} | ₹{product.price} / {product.unit} |{" "}
                        {product.quantity} {product.unit || product.customUnit}s available
                      </p>
                    </div>
                  </div>
                ))}
              <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/supplier/products")}
              >
                See more
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Placeholder */}
      <div className="hidden md:block mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-4">ORDER ID</th>
              <th className="text-left py-2 px-4">VENDOR</th>
              <th className="text-left py-2 px-4">PRODUCTS</th>
              <th className="text-left py-2 px-4">TOTAL</th>
              <th className="text-left py-2 px-4">STATUS</th>
              <th className="text-left py-2 px-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4">#12345</td>
              <td className="py-2 px-4">Vendor X</td>
              <td className="py-2 px-4">Tomatoes, Oil</td>
              <td className="py-2 px-4">₹500</td>
              <td className="py-2 px-4">Pending</td>
              <td className="py-2 px-4">
                <button className="text-blue-600 hover:underline">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierDashboard;
