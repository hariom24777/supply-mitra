import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { IoTrash } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const auth = getAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "suppliers", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProducts(data.products || []);
        }
      }
    };
    fetchProducts();
  }, [auth]);

  const handleDelete = async (product) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "suppliers", user.uid);
      await updateDoc(docRef, {
        products: arrayRemove(product),
      });
      setProducts((prev) => prev.filter((p) => p !== product));
    }
  };

  const handleEditChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (index) => {
    const user = auth.currentUser;
    const oldProduct = products[index];
    const updatedProduct = {
      name: editedProduct.name,
      category: editedProduct.category,
      price: parseFloat(editedProduct.price),
      quantity: parseInt(editedProduct.quantity),
    };

    if (user) {
      const docRef = doc(db, "suppliers", user.uid);
      await updateDoc(docRef, {
        products: arrayRemove(oldProduct),
      });
      await updateDoc(docRef, {
        products: arrayUnion(updatedProduct),
      });
      const updatedList = [...products];
      updatedList[index] = updatedProduct;
      setProducts(updatedList);
      setEditingIndex(null);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="rounded px-4 py-3 shadow bg-white flex flex-col justify-between"
            >
              {editingIndex === index ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="Product Name"
                  />
                  <input
                    type="text"
                    name="category"
                    value={editedProduct.category}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="Category"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={editedProduct.quantity}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="Quantity"
                  />
                  <button
                    onClick={() => handleEditSubmit(index)}
                    className="bg-green-600 text-white px-4 py-2 rounded w-full"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.category} • ₹{product.price} • {product.quantity}{" "}
                      units
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <button
                      onClick={() => {
                        setEditingIndex(index);
                        setEditedProduct(product);
                      }}
                      className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MdEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <IoTrash /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
