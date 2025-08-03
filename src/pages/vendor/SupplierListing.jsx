import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { MdLocationOn, MdPhone } from "react-icons/md";

const SupplierListing = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      const supplierList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuppliers(supplierList);
      setFilteredSuppliers(supplierList);
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSuppliers(suppliers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = suppliers.filter(
        (supplier) =>
          supplier.city?.toLowerCase().includes(term) ||
          supplier.category?.toLowerCase().includes(term) ||
          supplier.name?.toLowerCase().includes(term)
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchTerm, suppliers]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Suppliers</h2>

          {/* Filter */}
          <input
            type="text"
            placeholder="Search by City, Category, or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 rounded-lg w-full md:w-1/2"
          />
        </div>

        {/* Supplier Cards */}
        {filteredSuppliers.length === 0 ? (
          <div className="text-gray-500 text-center">No suppliers found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{supplier.name}</h3>

                <div className="flex items-center text-sm text-gray-700 mt-1">
                  <MdLocationOn className="mr-1" />
                  {supplier.city}
                </div>

                <div className="flex items-center text-sm text-gray-700 mt-1">
                  <MdPhone className="mr-1" />
                  {supplier.mobile || "Not Available"}
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Category: {supplier.category || "Not Available"}
                </p>

                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all transition-duration-300 cursor-pointer"
                  onClick={() =>
                    alert(`Currently not available. It will be updated soon.`)
                  }
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierListing;
