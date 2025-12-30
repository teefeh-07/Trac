import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '85542010...'; // Placeholder

export const initWalletConnect = async () => {
