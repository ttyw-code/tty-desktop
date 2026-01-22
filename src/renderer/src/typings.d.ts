export {};

declare global {
  interface Window {
    appBridge?: {
      quit: () => void;
    };
  }
}
