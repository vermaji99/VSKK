import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, LogOut, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: null,
    imageUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(items);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;

      if (formData.image) {
        const imageRef = ref(storage, `products/${Date.now()}_${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        imageUrl,
        updatedAt: new Date(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date()
        });
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', description: '', category: '', image: null, imageUrl: '' });
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
      image: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        // Also delete from storage if it was a firebase upload
        if (imageUrl && imageUrl.includes('firebasestorage')) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef).catch(e => console.log("Storage delete error (non-critical):", e));
        }
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white p-6 md:p-12 admin-page">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif gold-text tracking-widest uppercase">Dashboard</h1>
            <p className="small-text !text-white/40 mt-2">Manage your luxury product catalog</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', description: '', category: '', image: null, imageUrl: '' });
                setShowModal(true);
              }}
              className="btn-premium !px-6 flex items-center gap-2"
            >
              <Plus size={18} /> Add Product
            </button>
            <button 
              onClick={handleLogout}
              className="p-4 border border-white/10 hover:border-red-500/50 transition-colors text-white/60 hover:text-red-500"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {loading && !showModal ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <motion.div 
                layout
                key={product.id}
                className="glass-card overflow-hidden group border border-white/5 hover:border-accent-gold/30 transition-all"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-3 bg-white/10 rounded-full hover:bg-accent-gold hover:text-black transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id, product.imageUrl)}
                      className="p-3 bg-white/10 rounded-full hover:bg-red-500 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-accent-gold text-[10px] tracking-[0.3em] uppercase mb-2">{product.category}</p>
                  <h3 className="text-xl font-serif mb-3 group-hover:text-accent-gold transition-colors">{product.name}</h3>
                  <p className="text-white/40 text-sm line-clamp-2">{product.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative glass-card p-8 md:p-12 w-full max-w-2xl border border-white/10 overflow-y-auto max-h-[90vh]"
              >
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-serif gold-text tracking-widest uppercase mb-10">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="small-text block mb-2">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-accent-gold transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="small-text block mb-2">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-accent-gold transition-colors"
                        required
                        placeholder="e.g. Necklaces, Rings"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="small-text block mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-accent-gold transition-colors resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="small-text block mb-2">Product Image</label>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-full md:w-40 aspect-square bg-white/5 border border-dashed border-white/20 flex items-center justify-center relative overflow-hidden">
                        {(formData.image || formData.imageUrl) ? (
                          <img 
                            src={formData.image ? URL.createObjectURL(formData.image) : formData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="text-white/20" size={32} />
                        )}
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white/40 mb-4 italic">
                          Click the box to upload an image, or paste an image URL below.
                        </p>
                        <input
                          type="text"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          placeholder="Or paste external Image URL"
                          className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-accent-gold transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-premium py-4 mt-6"
                  >
                    {loading ? 'Processing...' : (editingId ? 'Update Product' : 'Create Product')}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
