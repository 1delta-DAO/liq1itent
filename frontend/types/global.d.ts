declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NETWORK: string;
      BACKEND_API_URL: string;
      WEB3_MODAL_PROJECT_ID: string;
      RPC_URL: string;
      LP_STAKING_CONTRACT_ADDRESS: string;
      LP_TOKEN_ADDRESS: string;
      LP_STAKING_REWARD_TOKEN_ADDRESS: string;
      SALE_CONTRACT_ADDRESS: string;
    }
  }

  interface Window {
    ethereum?: {
      request: (arg: {
        method: string;
        params?: Record<string, unknown>[];
      }) => Promise<void>;
    };
  }
}

export {};
