import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '85542010...'; // Placeholder

export const initWalletConnect = async () => {
    try {
        const core = new Core({
            projectId: PROJECT_ID,
        });

        const web3wallet = await Web3Wallet.init({
            core,
            metadata: {
                name: 'Trac',
                description: 'Supply Chain Transparency Platform',
                url: window.location.origin,
                icons: [`${window.location.origin}/vite.svg`],
            },
        });

        console.log('WalletConnect initialized:', web3wallet.metadata);
        return web3wallet;
    } catch (error) {
        console.error('Failed to init WalletConnect:', error);
        return null;
    }
