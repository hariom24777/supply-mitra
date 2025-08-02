import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { IoCart } from "react-icons/io5";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const vendorUID = auth.currentUser?.uid;

  const fetchCartItems = async () => {
    if (!vendorUID) return;
    try {
      const cartRef = collection(db, "vendors", vendorUID, "cart");
      const cartSnap = await getDocs(cartRef);
      const items = cartSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "vendors", vendorUID, "cart", itemId));
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    try {
      const itemRef = doc(db, "vendors", vendorUID, "cart", itemId);
      await updateDoc(itemRef, { quantity: newQty });
      fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-1"><IoCart /> My Cart</h2>
      {cartItems.length === 0 ? (
        <p>You have no item in cart.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>₹{item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="w-16 border px-2 py-1 rounded"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-semibold text-lg">
            Total: ₹{totalAmount}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
