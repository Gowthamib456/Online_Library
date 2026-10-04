import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../types';
import { useLibrary } from '../../context/LibraryContext';
import { Search, Book as BookIcon, Star } from 'lucide-react';
import Fuse from 'fuse.js';

export const Home = () => {
  const { books, recommendations } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');

  // Fuzzy Search Configuration
  const fuse = new Fuse(books, {
    keys: ['title', 'author', 'category'],
    threshold: 0.4, // Allow fuzzy matching
  });

  const searchResults = searchTerm 
    ? fuse.search(searchTerm).map(result => result.item)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Next Great Read</h1>
          <p className="text-blue-100 mb-8">Explore our vast collection of books across various disciplines.</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              className="w-full pl-12 pr-4 py-3 rounded-full text-slate-900 focus:ring-4 focus:ring-blue-400 outline-none shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Search Results */}
        {searchTerm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(book => (
                <Link to={`/book/${book.id}`} key={book.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition">
                  <div className="w-16 h-24 bg-slate-200 rounded flex items-center justify-center flex-shrink-0">
                    <BookIcon className="text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-slate-500">{book.author}</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                      {book.category}
                    </span>
                  </div>
                </Link>
              ))}
              {searchResults.length === 0 && (
                <p className="text-slate-500 col-span-full text-center py-8">No books found matching "{searchTerm}"</p>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
                <Star className="text-yellow-500 fill-yellow-500" />
                <h2 className="text-2xl font-bold text-slate-800">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {recommendations.map(book => (
                    <Link to={`/book/${book.id}`} key={book.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition group">
                        <div className="aspect-[2/3] bg-slate-200 rounded-lg mb-4 flex items-center justify-center group-hover:bg-slate-300 transition">
                            <BookIcon size={40} className="text-slate-400" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-1">{book.title}</h3>
                        <p className="text-xs text-slate-500">{book.author}</p>
                    </Link>
                ))}
            </div>
        </div>

        {/* Categories */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, idx) => (
            <Link 
              to={`/category/${encodeURIComponent(category)}`} 
              key={idx}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <BookIcon size={24} />
              </div>
              <h3 className="font-semibold text-slate-800">{category}</h3>
              <p className="text-xs text-slate-400 mt-2">15 Books</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
