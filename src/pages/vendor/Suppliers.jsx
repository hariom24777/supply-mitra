import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { IoCall, IoLocate } from "react-icons/io5";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      const supplierList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuppliers(supplierList);
    };

    fetchSuppliers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Nearby Suppliers</h2>
      {suppliers.length === 0 ? (
        <p>No suppliers available yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{supplier.name}</h3>
              <p><IoLocate /> {supplier.location}</p>
              <p>📦 {supplier.category}</p>
              <p><IoCall /> {supplier.contact}</p>
              <button
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => alert("Add to cart or view products")}
              >
                View Products
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate("/vendor/dashboard")}
        className="mt-6 block bg-gray-600 text-white px-4 py-2 rounded"
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default Suppliers;
