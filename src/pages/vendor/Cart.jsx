import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { IoCart } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

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

  const handlePlaceOrder = async () => {
    const vendorUID = auth.currentUser?.uid;
    if (!vendorUID || cartItems.length === 0) return;

    try {
      setPlacingOrder(true);

      const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Create order
      await addDoc(collection(db, "orders"), {
        vendorId: vendorUID,
        items: cartItems,
        totalAmount,
        orderedAt: serverTimestamp(),
        buyerName: auth.currentUser.displayName || "Unknown Vendor",
      });

      // Clear cart
      await updateDoc(doc(db, "carts", vendorUID), {
        items: [],
      });

      setCartItems([]);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) return <div className="p-4">Loading cart...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <IoCart /> My Cart
      </h2>

      {cartItems.length === 0 ? (
        <p>You have no items in cart.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart items */}
          <div className="flex-1 space-y-4">
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
                  <p className="text-sm text-gray-500">
                    From: {item.supplierName}
                  </p>
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
          </div>

          {/* Summary Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white shadow-lg p-6 rounded-xl sticky top-6">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Total Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t pt-2">
                <span>Total Price:</span>
                <span>₹{totalAmount}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg disabled:opacity-60"
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
