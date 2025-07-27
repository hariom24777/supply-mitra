import React from 'react';

const CartSidebar = ({ showCart, setShowCart, cart, vendorData }) => {
  if (!showCart) return null; // Exit early if not visible

  const totalAmount = Object.entries(cart).reduce((total, [key, qty]) => {
    const [vendorIdx, prodIdx] = key.split("-").map(Number);
    return total + vendorData[vendorIdx].products[prodIdx].price * qty;
  }, 0);

  return (
<div className="fixed inset-0 bg-transparent  z-40" onClick={() => setShowCart(false)}>

      <div
        className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={() => setShowCart(false)} className="text-red-500 text-lg">✕</button>
        </div>

        {Object.keys(cart).length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(cart).map(([key, qty]) => {
              const [vendorIdx, prodIdx] = key.split("-").map(Number);
              const product = vendorData[vendorIdx].products[prodIdx];

              return (
                <div key={key} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">Qty: {qty}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">₹{product.price * qty}</div>
                  </div>
                </div>
              );
            })}

            <div className="text-right pt-4 border-t font-semibold text-lg">
              Total: ₹{totalAmount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
