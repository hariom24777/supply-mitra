import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SupplierProfileSetup = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [supplierType, setSupplierType] = useState("");
  const [photo, setPhoto] = useState(null);
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
      let photoURL = "";

      if (photo) {
        const photoRef = ref(storage, `supplierPhotos/${user.uid}`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, "suppliers", user.uid), {
        name,
        location,
        supplierType,
        photoURL,
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
        <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border border-gray-300 rounded-md"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full p-3 border border-gray-300 rounded-md"
          required
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="w-full p-3 border border-gray-300 rounded-md"
          required
          onChange={(e) => setSupplierType(e.target.value)}
        >
          <option value="">Select Supplier Type</option>
          <option value="Raw Materials">Raw Materials</option>
          <option value="Packaging">Packaging</option>
          <option value="Logistics">Logistics</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default SupplierProfileSetup;

