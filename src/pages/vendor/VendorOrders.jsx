import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { FaBoxOpen } from "react-icons/fa";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const vendorUID = auth.currentUser?.uid;
    if (!vendorUID) return;

    try {
      const q = query(
        collection(db, "orders"),
        where("vendorId", "==", vendorUID),
        orderBy("orderedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDateTime = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString(); // shows date + time
  };

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaBoxOpen /> Placed Orders
      </h2>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-600 text-sm">Order ID: {order.id}</div>
                <div className="text-sm text-gray-500">
                  {formatDateTime(order.orderedAt)}
                </div>
              </div>
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    {item.name} – ₹{item.price} x {item.quantity}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-3 items-center font-semibold text-lg">
                
                  Total: ₹{order.totalAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
