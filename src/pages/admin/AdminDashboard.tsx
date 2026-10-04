import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Package, Users, BookOpen, Truck, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AdminDashboard = () => {
  const { books, orders, updateBookStatus, updateOrderStatus } = useLibrary();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders'>('overview');

  // Stats Calculation
  const totalBooks = books.length;
  const issuedBooks = orders.reduce((acc, order) => acc + order.items.length, 0);
  const activeUsers = new Set(orders.map(o => o.userId)).size;
  
  // Chart Data Preparation
  const categoryData = books.reduce((acc: any, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});
  
  const categoryChartData = Object.keys(categoryData).map(key => ({
    name: key.split(' ')[0], // Shorten name
    count: categoryData[key]
  }));

  const orderStatusData = orders.reduce((acc: any, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(orderStatusData).map(key => ({
    name: key,
    value: orderStatusData[key]
  }));

  const downloadCSV = () => {
    const headers = ["Order ID", "User ID", "Date", "Total", "Status", "Items"];
    const rows = orders.map(o => [
      o.id, 
      o.userId, 
      o.orderDate, 
      o.totalAmount, 
      o.status, 
      o.items.map(i => i.title).join(' | ')
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "library_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500">Manage books, orders, and view statistics</p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/home"
              className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm"
            >
              <ExternalLink size={18} /> View User Site
            </Link>
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm"
            >
              <Download size={18} /> Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><BookOpen /></div>
              <div>
                <p className="text-sm text-slate-500">Total Books</p>
                <h3 className="text-2xl font-bold">{totalBooks}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Package /></div>
              <div>
                <p className="text-sm text-slate-500">Books Issued</p>
                <h3 className="text-2xl font-bold">{issuedBooks}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Users /></div>
              <div>
                <p className="text-sm text-slate-500">Active Users</p>
                <h3 className="text-2xl font-bold">{activeUsers}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full"><Truck /></div>
              <div>
                <p className="text-sm text-slate-500">Active Deliveries</p>
                <h3 className="text-2xl font-bold">{orders.filter(o => o.status !== 'delivered').length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          {['overview', 'inventory', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 px-4 font-medium capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Books by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Order Status Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-medium text-slate-600">Book Title</th>
                  <th className="p-4 font-medium text-slate-600">Author</th>
                  <th className="p-4 font-medium text-slate-600">RFID</th>
                  <th className="p-4 font-medium text-slate-600">Status</th>
                  <th className="p-4 font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-slate-50">
                    <td className="p-4">{book.title}</td>
                    <td className="p-4 text-slate-500">{book.author}</td>
                    <td className="p-4 font-mono text-xs bg-slate-100 rounded w-fit">{book.rfid}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {book.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => updateBookStatus(book.id, !book.inStock)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Toggle Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-medium text-slate-600">Order ID</th>
                  <th className="p-4 font-medium text-slate-600">Date</th>
                  <th className="p-4 font-medium text-slate-600">Items</th>
                  <th className="p-4 font-medium text-slate-600">Status</th>
                  <th className="p-4 font-medium text-slate-600">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono text-sm">{order.id}</td>
                    <td className="p-4 text-sm">{format(new Date(order.orderDate), 'MMM dd, yyyy')}</td>
                    <td className="p-4 text-sm">{order.items.length} Books</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        className="border rounded p-1 text-sm"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
