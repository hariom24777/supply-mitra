import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { MdLocationOn, MdPhone } from "react-icons/md";

const VendorListing = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      const querySnapshot = await getDocs(collection(db, "vendors"));
      const vendorList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVendors(vendorList);
      setFilteredVendors(vendorList);
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVendors(vendors);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = vendors.filter(
        (vendor) =>
          vendor.city?.toLowerCase().includes(term) ||
          vendor.category?.toLowerCase().includes(term) ||
          vendor.name?.toLowerCase().includes(term)
      );
      setFilteredVendors(filtered);
    }
  }, [searchTerm, vendors]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Vendors</h2>

          {/* Filter */}
          <input
            type="text"
            placeholder="Search by City, Category, or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-600 rounded-lg w-full md:w-1/2"
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
                  {vendor.mobile || "Not Available"}
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Category: {vendor.category || "Not Available"}
                </p>

                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all transition-duration-300 cursor-pointer"
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

export default VendorListing;
