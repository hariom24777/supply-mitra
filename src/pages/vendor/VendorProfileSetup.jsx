import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const VendorProfileSetup = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      const currentUser = u || auth.currentUser;
      if (currentUser) {
        const docSnap = await getDoc(doc(db, "vendors", currentUser.uid));
        if (docSnap.exists() && docSnap.data().isProfileComplete) {
          navigate("/vendor/dashboard");
        } else {
          setUser(currentUser);
        }
      } else {
        navigate("/vendor/login");
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setDoc(doc(db, "vendors", user.uid), {
        name,
        city,
        photoURL: "", // Optional 
        uid: user.uid,
        email: user.email,
        isProfileComplete: true,
      });

      navigate("/vendor/dashboard");
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
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          required
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 cursor-pointer"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default VendorProfileSetup;
