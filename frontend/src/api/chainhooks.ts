import { ChainhooksClient } from '@hirosystems/chainhooks-client';

const CHAINHOOKS_API_URL = 'http://localhost:20456'; // Default Chainhook service

export const chainhookClient = new ChainhooksClient({
    url: CHAINHOOKS_API_URL,
    apiKey: import.meta.env.VITE_CHAINHOOK_API_KEY,
});

export const registerTrackingHook = async (contractAddress: string, contractName: string) => {
    try {
        const hook = {
            name: 'product-updates',
            uuid: 'trackr-product-updates',
            chain: 'stacks',
            version: 1,
            networks: {
                'mainnet': {
