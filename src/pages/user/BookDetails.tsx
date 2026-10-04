import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../../context/LibraryContext';
import { ArrowLeft, ShoppingBag, BookOpen, ScanLine, Star } from 'lucide-react';

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, addToCart } = useLibrary();
  const [message, setMessage] = useState('');
  
  const book = books.find(b => b.id === id);

  if (!book) return <div className="p-8 text-center">Book not found</div>;

  const handleAddToCart = (type: 'buy' | 'borrow') => {
    const result = addToCart(book, type);
    setMessage(result.message);
    if (result.success) {
        setTimeout(() => navigate('/cart'), 1000);
    } else {
        setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row">
        {/* Left: Image Placeholder */}
        <div className="md:w-1/3 bg-slate-200 flex items-center justify-center p-12">
          <BookOpen size={80} className="text-slate-400" />
        </div>

        {/* Right: Details */}
        <div className="md:w-2/3 p-8">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-2">
            <ArrowLeft size={18} /> Back
          </button>

          <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{book.title}</h1>
                <p className="text-lg text-slate-500 mb-4">{book.author}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700">
                <Star size={16} className="fill-yellow-500 text-yellow-500" />
                <span className="font-bold">{book.rating}</span>
                <span className="text-xs text-yellow-600">({book.reviews})</span>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="bg-slate-100 px-3 py-1 rounded text-sm font-mono text-slate-600 flex items-center gap-2">
                <ScanLine size={14} /> {book.rfid}
            </div>
            <span className={`px-3 py-1 rounded text-sm font-medium ${book.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {book.inStock ? 'Available' : 'Out of Stock'}
            </span>
          </div>

          <p className="text-slate-600 mb-8 leading-relaxed">
            This is a placeholder description for "{book.title}". In a real application, this would contain the book's synopsis.
            Explore the depths of {book.category} with this masterpiece.
          </p>

          {message && (
            <div className={`mb-4 p-3 rounded text-sm ${message.includes('Added') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
                onClick={() => handleAddToCart('buy')}
                disabled={!book.inStock}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
            >
                <ShoppingBag size={20} /> Buy for ₹{book.price}
            </button>
            <button 
                onClick={() => handleAddToCart('borrow')}
                disabled={!book.inStock}
                className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-slate-300 disabled:text-slate-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
            >
                <BookOpen size={20} /> Borrow (Study & Return)
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Borrowing limited to 7 days. Renewal available at ₹30/day. Late fine ₹50/day.
          </p>
        </div>
      </div>
    </div>
  );
};
