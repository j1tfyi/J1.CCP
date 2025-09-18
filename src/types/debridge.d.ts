declare global {
  interface Window {
    deBridge?: {
      widget: (config: any) => void;
    };
  }
}

export {};