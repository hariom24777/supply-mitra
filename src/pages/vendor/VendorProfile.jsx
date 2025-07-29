import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const VendorProfile = () => {
  const [vendorData, setVendorData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const vendorRef = doc(db, "vendors", currentUser.uid);
        const vendorSnap = await getDoc(vendorRef);

        if (vendorSnap.exists()) {
          setVendorData(vendorSnap.data());
          setEditedData(vendorSnap.data());
        } else {
          console.error("No vendor data found!");
        }
      } else {
        navigate("/vendor/login");
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
      const vendorRef = doc(db, "vendors", auth.currentUser.uid);
      await updateDoc(vendorRef, editedData);
      setVendorData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/vendor/login");
  };

  if (!vendorData) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://via.placeholder.com/100"
            alt="Vendor Avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800">Vendor Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Name</label>
            <input
              type="text"
              value={vendorData.name || ""}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              value={vendorData.email || ""}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Business Name</label>
            <input
              type="text"
              value={vendorData.businessName || ""}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
