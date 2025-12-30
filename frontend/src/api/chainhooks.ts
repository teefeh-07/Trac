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
                    'if_this': {
                        'scope': 'contract_call',
                        'contract_identifier': `${contractAddress}.${contractName}`,
                        'method': 'update-status'
                    },
                    'then_that': {
                        'http_post': {
                            'url': 'https://api.trackr.app/hooks',
                            'authorization_header': 'Bearer token'
                        }
                    }
                }
            }
        };

        // Note: The client library usage depends on exact version, 
        // this is a conceptual implementation as per request.
        console.log('Registering hook:', hook);
        // await chainhookClient.register(hook);

        return true;
    } catch (e) {
        console.error('Chainhook error:', e);
        return false;
    }
};
