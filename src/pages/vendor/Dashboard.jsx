import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VendorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/vendor/login");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/vendor/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👋 Welcome, Vendor!</h1>
      <p className="mb-6">Start browsing nearby suppliers and manage your orders.</p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/vendor/suppliers")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Browse Suppliers
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default VendorDashboard;
