declare global {
    interface ImportMetaEnv {
        readonly VITE_APP_BOT_NAME: string;
        readonly VITE_APP_BOT_API: string;
        readonly VITE_APP_CENTIC_X_API_KEY: string;
        readonly VITE_APP_CENTIC_API_URL: string;
        readonly VITE_APP_BUNDLER_URL: string;
        readonly PAYMASTER_ADDRESS: string;
    }
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export const Env = import.meta.env;
