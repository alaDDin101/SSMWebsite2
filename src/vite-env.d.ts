/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public API origin (optional). Example: `https://api.example.com`. Leave unset to use same-origin + Vite proxy in dev. */
  readonly VITE_API_BASE_URL?: string;
  /** Google OAuth Web client ID (same as `Authentication:Google:ClientId` on the API). */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (resp: { credential?: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, string | number | boolean>) => void;
        };
      };
    };
  }
}

export {};
