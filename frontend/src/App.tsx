import React, { useState } from 'react';
import { ConnectWallet } from './components/ConnectWallet';

export default function App() {
    const [productId, setProductId] = useState('');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-3"></div>
                        <h1 className="text-xl font-bold text-gray-900">Trac</h1>
                    </div>
                    <ConnectWallet />
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Supply Chain Transparency
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Verify authenticity and track journey from origin to consumer.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="p-8">
                            <label htmlFor="product-id" className="block text-sm font-medium text-gray-700 mb-2">
                                Track Product
                            </label>
                            <div className="flex gap-4">
                                <input
                                    id="product-id"
                                    type="text"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    placeholder="Enter Product ID (e.g. 1042)"
                                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                                    Track
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                            <span>Recent Scans</span>
                            <span className="hover:text-indigo-600 cursor-pointer">View History &rarr;</span>
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
