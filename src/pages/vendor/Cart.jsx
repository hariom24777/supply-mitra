import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { IoCart } from "react-icons/io5";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    const vendorUID = auth.currentUser?.uid;
    if (!vendorUID) return;

    try {
      const cartRef = doc(db, "carts", vendorUID);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const data = cartSnap.data();
        setCartItems(data.items || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (indexToRemove) => {
    const vendorUID = auth.currentUser?.uid;
    if (!vendorUID) return;

    try {
      const updatedItems = cartItems.filter((_, i) => i !== indexToRemove);
      await updateDoc(doc(db, "carts", vendorUID), {
        items: updatedItems,
      });
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = async (indexToUpdate, newQty) => {
    const vendorUID = auth.currentUser?.uid;
    if (!vendorUID) return;

    try {
      const updatedItems = [...cartItems];
      updatedItems[indexToUpdate].quantity = newQty;

      await updateDoc(doc(db, "carts", vendorUID), {
        items: updatedItems,
      });
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
        <IoCart /> My Cart
      </h2>
      {cartItems.length === 0 ? (
        <p>You have no items in cart.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-white shadow rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>
                  ₹{item.price} x {item.quantity}
                </p>
                <p className="text-sm text-gray-500">From: {item.supplierName}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(index, Number(e.target.value))
                  }
                  className="w-16 border px-2 py-1 rounded"
                />
                <button
                  onClick={() => removeItem(index)}
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
