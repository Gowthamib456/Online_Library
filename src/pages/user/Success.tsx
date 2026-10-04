import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const Success = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h1>
            <p className="text-slate-500 mb-8">Your books will be delivered soon. You can track your order status in your profile.</p>
            
            <div className="space-y-3">
                <Link to="/home" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                    Continue Browsing
                </Link>
                <Link to="/profile" className="block w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-lg font-medium hover:bg-slate-50">
                    View My Orders
                </Link>
            </div>
        </div>
    </div>
  );
};
