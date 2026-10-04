import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, CreditCard, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const { cart, removeFromCart, placeOrder } = useLibrary();
  const { user, updateAddress } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState({ line1: '', city: '', state: '', zip: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [onlineProvider, setOnlineProvider] = useState('gpay');

  if (cart.length === 0 && step === 1) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <h2 className="text-2xl font-bold text-slate-400 mb-4">Your cart is empty</h2>
            <button onClick={() => navigate('/home')} className="text-blue-600 hover:underline">Go to Home</button>
        </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = () => {
    if (user) {
        placeOrder(user, address, paymentMethod);
        navigate('/success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>

        <div className="flex gap-4 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`flex-1 h-2 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Step 1: Cart Review */}
                {step === 1 && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Review Items</h2>
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-sm text-slate-500">{item.author}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${item.type === 'buy' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {item.type === 'buy' ? 'Buy for Own' : 'Study & Return'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold">₹{item.price}</span>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                Proceed to Address
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Address */}
                {step === 2 && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                placeholder="Address Line 1" 
                                className="border p-3 rounded-lg col-span-full"
                                value={address.line1}
                                onChange={e => setAddress({...address, line1: e.target.value})}
                            />
                            <input 
                                placeholder="City" 
                                className="border p-3 rounded-lg"
                                value={address.city}
                                onChange={e => setAddress({...address, city: e.target.value})}
                            />
                            <input 
                                placeholder="State" 
                                className="border p-3 rounded-lg"
                                value={address.state}
                                onChange={e => setAddress({...address, state: e.target.value})}
                            />
                            <input 
                                placeholder="ZIP Code" 
                                className="border p-3 rounded-lg"
                                value={address.zip}
                                onChange={e => setAddress({...address, zip: e.target.value})}
                            />
                            <input 
                                placeholder="Alternate Phone" 
                                className="border p-3 rounded-lg"
                                value={address.phone}
                                onChange={e => setAddress({...address, phone: e.target.value})}
                            />
                        </div>
                        <div className="mt-6 flex justify-between">
                            <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800">Back</button>
                            <button 
                                onClick={() => {
                                    updateAddress({...address, id: Date.now().toString()});
                                    setStep(3);
                                }} 
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                disabled={!address.line1 || !address.city}
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    checked={paymentMethod === 'online'} 
                                    onChange={() => setPaymentMethod('online')}
                                />
                                <div className="flex-1">
                                    <span className="font-medium block">Online Payment</span>
                                    <span className="text-xs text-slate-500">UPI, Cards, Netbanking</span>
                                </div>
                                <CreditCard className="text-slate-400" />
                            </label>

                            {paymentMethod === 'online' && (
                                <div className="ml-8 mb-4">
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {['PhonePe', 'GPay', 'UPI'].map(p => (
                                            <button 
                                                key={p}
                                                onClick={() => setOnlineProvider(p.toLowerCase())}
                                                className={`p-2 text-sm border rounded ${onlineProvider === p.toLowerCase() ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-sm font-bold text-slate-700 mb-3">Scan to Pay ₹{total}</p>
                                        <div className="bg-white p-2 rounded shadow-sm">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=library@upi&pn=DualiteLibrary&am=${total}`} 
                                                alt="Payment QR Code" 
                                                className="w-32 h-32"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">Supported by all UPI apps</p>
                                    </div>
                                </div>
                            )}

                            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    checked={paymentMethod === 'cod'} 
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <div className="flex-1">
                                    <span className="font-medium block">Cash on Delivery</span>
                                    <span className="text-xs text-slate-500">Pay when you receive</span>
                                </div>
                                <Truck className="text-slate-400" />
                            </label>
                        </div>

                        <div className="flex justify-between">
                            <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-800">Back</button>
                            <button 
                                onClick={handlePlaceOrder} 
                                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-200"
                            >
                                {paymentMethod === 'online' ? 'I have Paid & Place Order' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                    <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
