import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { Package, CheckCircle, Truck, Box, RefreshCw, RotateCcw, AlertCircle, Zap, X } from 'lucide-react';
import clsx from 'clsx';

const ORDER_STEPS = [
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { id: 'shipped', label: 'Shipped', icon: Box },
  { id: 'dispatched', label: 'Dispatched', icon: Truck },
  { id: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Package },
];

export const Profile = () => {
  const { orders, renewBook, returnBook } = useLibrary();
  const { user } = useAuth();
  const [actionMessage, setActionMessage] = useState<{id: string, msg: string} | null>(null);
  
  // Renewal Modal State
  const [renewalModal, setRenewalModal] = useState<{isOpen: boolean, orderId: string, bookId: string} | null>(null);

  const myOrders = orders.filter(o => o.userId === user?.id);

  const initiateRenew = (orderId: string, bookId: string) => {
    setRenewalModal({ isOpen: true, orderId, bookId });
  };

  const confirmRenew = () => {
    if (renewalModal) {
        const result = renewBook(renewalModal.orderId, renewalModal.bookId);
        setActionMessage({ id: renewalModal.bookId, msg: result.message });
        setRenewalModal(null);
        setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleReturn = (orderId: string, bookId: string) => {
    // Calculate potential fine for preview (simplified logic duplication for UI feedback)
    // In a real app, we'd have a helper function for this
    const order = orders.find(o => o.id === orderId);
    const item = order?.items.find(i => i.id === bookId);
    
    if(item && item.dueDate) {
        const now = new Date();
        const due = new Date(item.dueDate);
        now.setHours(0,0,0,0);
        due.setHours(0,0,0,0);
        
        let confirmMsg = "Are you sure you want to return this book?";
        if (now > due) {
            const diffDays = Math.ceil((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
            const fine = diffDays * 50;
            confirmMsg = `LATE RETURN WARNING\n\nYou are ${diffDays} days late.\nA fine of ₹${fine} will be deducted from your deposit refund.\n\nProceed with return?`;
        }

        if (window.confirm(confirmMsg)) {
            const result = returnBook(orderId, bookId);
            setActionMessage({ id: bookId, msg: result.message });
            setTimeout(() => setActionMessage(null), 5000);
        }
    }
  };

  const getStepStatus = (currentStatus: string, stepId: string) => {
    const statusOrder = ['confirmed', 'shipped', 'dispatched', 'out-for-delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
            <p className="text-slate-500 mb-8">Welcome, {user?.name}</p>

            <h2 className="text-xl font-bold mb-4">Order History & Tracking</h2>
            
            <div className="space-y-6">
                {myOrders.map(order => {
                    const isDelivered = order.status === 'delivered';
                    const actualDate = order.actualDeliveryDate ? new Date(order.actualDeliveryDate) : new Date();
                    const expectedDate = new Date(order.expectedDelivery);
                    const isEarly = isDelivered && actualDate.getTime() < expectedDate.getTime();

                    return (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Order Header */}
                            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <span className="text-xs font-mono text-slate-400 block mb-1">ORDER #{order.id}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800">₹{order.totalAmount}</span>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-sm text-slate-500">{new Date(order.orderDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-1">Delivery Status</p>
                                    <div className="flex items-center justify-end gap-2">
                                        {isEarly && (
                                            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                                <Zap size={12} className="fill-yellow-700" /> Delivered Early!
                                            </span>
                                        )}
                                        <p className="font-medium text-slate-800">
                                            {isDelivered 
                                                ? `Delivered on ${actualDate.toLocaleDateString()}` 
                                                : `Expected: ${expectedDate.toDateString()}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Tracker */}
                            <div className="p-6 bg-slate-50/50">
                                <div className="relative flex justify-between items-center">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0 transform -translate-y-1/2" />
                                    {ORDER_STEPS.map((step) => {
                                        const status = getStepStatus(order.status, step.id);
                                        const Icon = step.icon;
                                        return (
                                            <div key={step.id} className="relative z-10 flex flex-col items-center bg-slate-50 px-2">
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                                    status === 'completed' ? "bg-green-500 border-green-500 text-white" :
                                                    status === 'current' ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-110" :
                                                    "bg-white border-slate-300 text-slate-300"
                                                )}>
                                                    <Icon size={18} />
                                                </div>
                                                <span className={clsx(
                                                    "text-[10px] md:text-xs mt-2 font-medium text-center w-20",
                                                    status === 'current' ? "text-blue-600" : 
                                                    status === 'completed' ? "text-green-600" : "text-slate-400"
                                                )}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Items in this order</h3>
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition">
                                            <div className="mb-3 sm:mb-0">
                                                <h4 className="font-bold text-slate-800">{item.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={clsx(
                                                        "text-xs px-2 py-0.5 rounded capitalize",
                                                        item.type === 'buy' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                                                    )}>
                                                        {item.type === 'buy' ? 'Purchased' : 'Borrowed'}
                                                    </span>
                                                    {item.type === 'borrow' && item.isReturned && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                                                            <CheckCircle size={10} /> Returned
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons for Borrowed Books */}
                                            {item.type === 'borrow' && !item.isReturned && order.status === 'delivered' && (
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="text-xs text-right mb-1">
                                                        <span className="text-slate-500">Due: </span>
                                                        <span className={clsx(
                                                            "font-medium",
                                                            new Date(item.dueDate!) < new Date() ? "text-red-600" : "text-slate-700"
                                                        )}>
                                                            {new Date(item.dueDate!).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => initiateRenew(order.id, item.id)}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                                                        >
                                                            <RefreshCw size={12} /> Renew
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReturn(order.id, item.id)}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700"
                                                        >
                                                            <RotateCcw size={12} /> Return
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Feedback Message */}
                                            {actionMessage?.id === item.id && (
                                                <div className="w-full mt-2 text-xs p-2 bg-blue-50 text-blue-700 rounded flex items-center gap-2 sm:hidden">
                                                    <AlertCircle size={12} /> {actionMessage.msg}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Global Feedback Message for Desktop */}
                            {actionMessage && (
                                <div className="bg-blue-50 px-6 py-2 text-sm text-blue-700 border-t border-blue-100 flex items-center gap-2">
                                    <AlertCircle size={16} /> {actionMessage.msg}
                                </div>
                            )}
                        </div>
                    );
                })}

                {myOrders.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                        <Package size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No orders yet</h3>
                        <p className="text-slate-500">Start exploring our collection to place your first order.</p>
                    </div>
                )}
            </div>

            {/* Renewal Payment Modal */}
            {renewalModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
                        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold">Renew Book</h3>
                            <button onClick={() => setRenewalModal(null)} className="hover:bg-blue-700 p-1 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-slate-600 mb-4">Extend borrowing period by 7 days.</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block mb-4">
                                <img 
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=library@upi&am=210" 
                                    alt="QR Code" 
                                    className="w-32 h-32"
                                />
                            </div>
                            <div className="text-lg font-bold text-slate-800 mb-1">Total: ₹210</div>
                            <p className="text-xs text-slate-400 mb-6">₹30 per day × 7 days</p>
                            
                            <button 
                                onClick={confirmRenew}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
                            >
                                I have Paid & Renew
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
