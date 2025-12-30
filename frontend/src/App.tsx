import React, { useState } from 'react';
import { ConnectWallet } from './components/ConnectWallet';

export default function App() {
    const [productId, setProductId] = useState('');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-sm border-b border-gray-200">
