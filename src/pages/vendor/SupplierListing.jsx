import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { MdLocationOn, MdPhone } from "react-icons/md";

const SupplierListing = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // Optional additional filter

  useEffect(() => {
    const fetchSuppliers = async () => {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      const supplierList = [];
      querySnapshot.docs.forEach((doc) => {
        supplierList.push({ id: doc.id, ...doc.data() });
      });
      setSuppliers(supplierList);
      setFilteredSuppliers(supplierList);
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    let filtered = suppliers;

    if (locationFilter.trim() !== "") {
      filtered = filtered.filter((supplier) =>
        supplier.city?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (typeFilter.trim() !== "") {
      filtered = filtered.filter((supplier) =>
        supplier.category?.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredSuppliers(filtered);
  }, [locationFilter, typeFilter, suppliers]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Browse Suppliers</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by City"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-3 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Filter by Category"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-3 rounded-lg border border-gray-300"
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
                  {supplier.mobile}
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  onClick={() => alert(`Contact ${supplier.name}`)}
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
