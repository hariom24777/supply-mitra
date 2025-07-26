import React from 'react'
const mockInventory = [
  {
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: '$2.50/kg',
    quantity: '150 kg available',
  },
  {
    name: 'Organic Olive Oil',
    category: 'Oil',
    price: '$12.99/bottle',
    quantity: '75 bottles available',
  },
  {
    name: 'Black Pepper',
    category: 'Spices',
    price: '$8.50/kg',
    quantity: '25 kg available',
  },
];
const Dashboard = () => {
  return (
  <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar (topbar on mobile) */}
      <aside className="w-full lg:w-60 bg-white shadow flex flex-row lg:flex-col py-2 lg:py-5 sticky top-0 z-10">
        <div className="flex items-center px-4 py-2 gap-3 lg:px-6 lg:py-3">
          <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl font-bold">S</div>
          <div>
            <div className="font-semibold text-base lg:text-lg">supply-mitra</div>
            <div className="text-gray-500 text-xs">Supplier Portal</div>
          </div>
        </div>
        {/* Navigation stack as row on mobile, column on desktop */}
        <nav className="flex-1">
          <ul className="flex flex-row lg:flex-col gap-1 w-full items-center justify-center lg:mt-5">
            <li>
              <a href="#" className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm lg:rounded-r-full lg:w-auto">
                <span className="mr-1">✓</span> Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full font-medium text-sm lg:rounded-r-full lg:w-auto">
                <span className="mr-1">📦</span> Products
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full font-medium text-sm lg:rounded-r-full lg:w-auto">
                <span className="mr-1">🛒</span> Orders
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full font-medium text-sm lg:rounded-r-full lg:w-auto">
                <span className="mr-1">👥</span> Vendors
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full font-medium text-sm lg:rounded-r-full lg:w-auto">
                <span className="mr-1">⚙️</span> Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-2 md:p-4 lg:p-8">
        {/* TopBar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Supplier Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage your products and orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="relative">
              <span className="material-icons text-gray-500 text-2xl">notifications</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">2</span>
            </span>
            <div className="flex items-center space-x-2">
              <img src="https://i.pravatar.cc/32?img=2" alt="profile" className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-sm font-semibold">John Smith</div>
                <div className="text-xs text-gray-500">Supplier</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2">
          {/* Add New Product */}
          <div className="bg-white p-4 md:p-6 rounded shadow">
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center">Add New Product</h2>
            <form className="space-y-3">
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select className="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
                  <option>Select category</option>
                  <option>Vegetables</option>
                  <option>Oil</option>
                  <option>Spices</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Price per Unit</label>
                <input type="number" placeholder="$ 0.00" className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
              </div>
              <div>
                <label className="text-sm font-medium">Available Quantity</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
              </div>
              <button type="button" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">Add Product</button>
            </form>
          </div>

          {/* Product Inventory */}
          <div className="bg-white p-4 md:p-6 rounded shadow">
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center">Product Inventory</h2>
            <div className="space-y-3">
              {mockInventory.map((item) => (
                <div key={item.name} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border rounded px-3 py-2 sm:px-4 sm:py-3 gap-2">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.category} • {item.price} • {item.quantity}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <span className="material-icons text-base">edit</span>
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <span className="material-icons text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-4 md:mt-8 bg-white p-4 md:p-6 rounded shadow">
          <h2 className="text-base md:text-lg font-semibold mb-4">Recent Orders from Vendors</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-2 md:px-4 text-left font-bold text-gray-700">ORDER ID</th>
                  <th className="py-2 px-2 md:px-4 text-left font-bold text-gray-700">VENDOR</th>
                  <th className="py-2 px-2 md:px-4 text-left font-bold text-gray-700">PRODUCTS</th>
                  <th className="py-2 px-2 md:px-4 text-left font-bold text-gray-700">TOTAL</th>
                  <th className="py-2 px-2 md:px-4 text-left font-bold text-gray-700">STATUS</th>
                  <th className="py-2 px-2 md:px-4 text-left font-bold text-gray-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-2 md:px-4">#12345</td>
                  <td className="py-2 px-2 md:px-4">Vendor X</td>
                  <td className="py-2 px-2 md:px-4">Tomatoes, Oil</td>
                  <td className="py-2 px-2 md:px-4">$500</td>
                  <td className="py-2 px-2 md:px-4">Pending</td>
                  <td className="py-2 px-2 md:px-4"><button className="text-blue-600">View</button></td>
                </tr>
                {/* More mock rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
  
}

export default Dashboard
