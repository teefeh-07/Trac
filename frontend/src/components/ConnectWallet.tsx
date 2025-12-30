import React, { useEffect, useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

interface ConnectWalletProps {
    onConnect?: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleConnect = () => {
        showConnect({
            appDetails: {
                name: 'Trac',
                icon: window.location.origin + '/vite.svg',
            },
            redirectTo: '/',
            onFinish: () => {
                if (onConnect) onConnect();
                // window.location.reload();
            },
            userSession,
        });
    };

    const handleDisconnect = () => {
        userSession.signUserOut();
        window.location.reload();
    };

    if (!mounted) return null;

    if (userSession.isUserSignedIn()) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    {userSession.loadUserData().profile.stxAddress.mainnet.slice(0, 6)}...
                    {userSession.loadUserData().profile.stxAddress.mainnet.slice(-4)}
                </span>
                <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
        >
            Connect Wallet
        </button>
    );
};
