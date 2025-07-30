import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { MdLocationOn, MdPhone } from "react-icons/md";

const VendorListing = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // Optional additional filter

  useEffect(() => {
    const fetchVendors = async () => {
      const querySnapshot = await getDocs(collection(db, "vendors"));
      const vendorList = [];
      querySnapshot.forEach((doc) => {
        vendorList.push({ id: doc.id, ...doc.data() });
      });
      setVendors(vendorList);
      setFilteredVendors(vendorList);
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    let filtered = vendors;

    if (locationFilter.trim() !== "") {
      filtered = filtered.filter((vendor) =>
        vendor.city?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (typeFilter.trim() !== "") {
      filtered = filtered.filter((vendor) =>
        vendor.category?.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  }, [locationFilter, typeFilter, vendors]);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Browse Vendors</h2>

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
            placeholder="Filter by Category (e.g. Vegetables, Dairy)"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-3 rounded-lg border border-gray-300"
          />
        </div>

        {/* Vendor Cards */}
        {filteredVendors.length === 0 ? (
          <div className="text-gray-500 text-center">No vendors found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{vendor.name}</h3>

                <div className="flex items-center text-sm text-gray-700 mt-1">
                  <MdLocationOn className="mr-1" />
                  {vendor.city}
                </div>

                <div className="flex items-center text-sm text-gray-700 mt-1">
                  <MdPhone className="mr-1" />
                  {vendor.mobile}
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Category: {vendor.category || "N/A"}
                </p>

                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  onClick={() => alert(`Contact ${vendor.name}`)}
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

export default VendorListing;
