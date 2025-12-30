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
