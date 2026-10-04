import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLibrary } from '../../context/LibraryContext';
import { Book as BookIcon, ArrowLeft } from 'lucide-react';

export const CategoryView = () => {
  const { category } = useParams();
  const { books } = useLibrary();
  
  const categoryBooks = books.filter(b => b.category === decodeURIComponent(category || ''));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="container mx-auto">
        <Link to="/home" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-8">{decodeURIComponent(category || '')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryBooks.map(book => (
            <Link to={`/book/${book.id}`} key={book.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex">
              <div className="w-32 bg-slate-200 flex items-center justify-center flex-shrink-0">
                <BookIcon size={32} className="text-slate-400" />
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-bold text-slate-800 line-clamp-2 mb-1">{book.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{book.author}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-blue-600 font-bold">₹{book.price}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${book.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {book.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
