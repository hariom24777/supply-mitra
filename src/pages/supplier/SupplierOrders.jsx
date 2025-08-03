import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { FaClipboardList } from "react-icons/fa";

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplierName, setSupplierName] = useState("");

  useEffect(() => {
    const fetchSupplierName = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const snapshot = await getDocs(collection(db, "suppliers"));
      const supplierDoc = snapshot.docs.find((doc) => doc.id === uid);
      if (supplierDoc) {
        setSupplierName(supplierDoc.data().name);
      }
    };

    fetchSupplierName();
  }, []);

  useEffect(() => {
    if (!supplierName) return;

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("orderedAt", "desc"));
        const snapshot = await getDocs(q);
        const allOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter orders containing items from this supplier
        const supplierOrders = allOrders
          .map((order) => ({
            ...order,
            items: order.items.filter(
              (item) => item.supplierName === supplierName
            ),
          }))
          .filter((order) => order.items.length > 0);

        setOrders(supplierOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supplierName]);

  const formatDateTime = (timestamp) => {
    const date = timestamp?.toDate?.();
    return date ? date.toLocaleString() : "N/A";
  };

  if (loading) return <div className="p-4">Loading supplier orders...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaClipboardList /> Incoming Orders
      </h2>

      {orders.length === 0 ? (
        <p>No orders received yet.</p>
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
                    {item.name} – ₹{item.price} × {item.quantity}
                  </div>
                ))}
              </div>

              <div className="text-right font-semibold text-lg mt-2">
                Total (Your Products): ₹
                {order.items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierOrders;
