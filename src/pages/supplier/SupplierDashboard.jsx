import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { IoTrash } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const SupplierDashboard = () => {
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
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
    const newProduct = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
    };

    try {
      await updateDoc(supplierRef, {
        products: arrayUnion(newProduct),
      });

      setForm({ name: "", category: "", price: "", quantity: "" });
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
                className="w-full mt-1 p-2 border rounded"
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
                className="w-full mt-1 p-2 border rounded"
                required
              >
                <option value="">Select category</option>
                <option>Vegetables</option>
                <option>Oil</option>
                <option>Spices</option>
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
                className="w-full mt-1 p-2 border rounded"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Available Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
                placeholder="Enter quantity"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Product Inventory */}
        {/* Product Inventory */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Product Inventory</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <div className="space-y-4">
              {[...products]
                .slice(-4)
                .reverse() // Optional: newest on top
                .map((product, index) => (
                  <div
                    key={index}
                    className="border rounded px-4 py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.category} • ₹{product.price} •{" "}
                        {product.quantity} available
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <button className="text-blue-600 hover:underline">
                        <MdEdit size={18} />
                      </button>
                      <button className="text-red-600 hover:underline">
                        <IoTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
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
