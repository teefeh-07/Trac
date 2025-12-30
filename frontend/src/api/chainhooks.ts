import { ChainhooksClient } from '@hirosystems/chainhooks-client';

const CHAINHOOKS_API_URL = 'http://localhost:20456'; // Default Chainhook service

export const chainhookClient = new ChainhooksClient({
    url: CHAINHOOKS_API_URL,
    apiKey: import.meta.env.VITE_CHAINHOOK_API_KEY,
});

