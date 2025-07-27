import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { IoTrash } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const SupplierDashboard = () => {
  const [userData, setUserData] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "suppliers", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchData();
  }, [auth]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Supplier Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage your products and orders
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Product */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select className="w-full mt-1 p-2 border rounded">
                <option>Select category</option>
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
                className="w-full mt-1 p-2 border rounded"
                placeholder="$ 0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Available Quantity
              </label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded"
                placeholder="Enter quantity"
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
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Product Inventory</h2>

          <div className="space-y-4">
            {[
              {
                name: "Fresh Tomatoes",
                category: "Vegetables",
                price: "$2.50/kg",
                quantity: "150 kg",
              },
              {
                name: "Organic Olive Oil",
                category: "Oil",
                price: "$12.99/bottle",
                quantity: "75 bottles",
              },
              {
                name: "Black Pepper",
                category: "Spices",
                price: "$8.50/kg",
                quantity: "25 kg",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="border rounded px-4 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.category} • {product.price} • {product.quantity}{" "}
                    available
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  {/* Edit Button */}
                  <button className="text-blue-600 hover:underline">
                    <span className="hidden sm:inline">Edit</span>
                    <MdEdit className="inline sm:hidden" size={18} />
                  </button>

                  {/* Delete Button */}
                  <button className="text-red-600 hover:underline">
                    <span className="hidden sm:inline">Delete</span>
                    <IoTrash className="inline sm:hidden" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional: Desktop-only Orders Table */}
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
              <td className="py-2 px-4">$500</td>
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
