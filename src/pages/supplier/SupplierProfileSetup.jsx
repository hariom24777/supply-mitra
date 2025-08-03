import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SupplierProfileSetup = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [supplierType, setSupplierType] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      const currentUser = u || auth.currentUser;
      if (currentUser) {
        const docSnap = await getDoc(doc(db, "suppliers", currentUser.uid));
        if (docSnap.exists() && docSnap.data().isProfileComplete) {
          navigate("/supplier/dashboard");
        } else {
          setUser(currentUser);
        }
      } else {
        navigate("/supplier/login");
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setDoc(doc(db, "suppliers", user.uid), {
        name,
        city,
        // supplierType,
        photoURL: "", // Optional 
        uid: user.uid,
        email: user.email,
        isProfileComplete: true,
      });

      navigate("/supplier/dashboard");
    } catch (err) {
      alert("Error saving profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">
          Complete Your Profile
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
          required
          onChange={(e) => setCity(e.target.value)}
        />

        {/* <select
          className="w-full p-3 border border-gray-300 rounded-md"
          required
          onChange={(e) => setSupplierType(e.target.value)}
        >
          <option value="">Select Supplier Type</option>
          <option value="Raw Materials">Raw Materials</option>
          <option value="Packaging">Packaging</option>
          <option value="Logistics">Logistics</option>
          <option value="Others">Others</option>
        </select> */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300 cursor-pointer"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default SupplierProfileSetup;
