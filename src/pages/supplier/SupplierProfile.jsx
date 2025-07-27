import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SupplierProfile = () => {
  const [supplierData, setSupplierData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const supplierRef = doc(db, "suppliers", currentUser.uid);
        const supplierSnap = await getDoc(supplierRef);

        if (supplierSnap.exists()) {
          setSupplierData(supplierSnap.data());
          setEditedData(supplierSnap.data());
        } else {
          console.error("No supplier data found!");
        }
      } else {
        navigate("/supplier/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const supplierRef = doc(db, "suppliers", auth.currentUser.uid);
      await updateDoc(supplierRef, editedData);
      setSupplierData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/supplier/login");
  };

  if (!supplierData) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://via.placeholder.com/100"
            alt="Supplier Avatar"
            className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300"
          />
          <h2 className="text-2xl font-bold text-gray-800">Supplier Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={editedData.name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={supplierData.email}
              disabled
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={editedData.companyName || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={editedData.mobile || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={editedData.city || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>

          {isEditing ? (
            <button
              className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              onClick={handleSave}
            >
              Save Changes
            </button>
          ) : (
            <button
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;
