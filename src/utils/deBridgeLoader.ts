// Centralized deBridge widget loader to ensure consistent loading across all components

declare global {
  interface Window {
    deBridge?: any;
  }
}

let loadPromise: Promise<void> | null = null;

export const loadDeBridgeSDK = (): Promise<void> => {
  // If already loading or loaded, return the existing promise
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.deBridge) {
      console.log('[deBridge Loader] SDK already loaded');
      resolve();
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src="https://app.debridge.finance/assets/scripts/widget.js"]');

    if (existingScript) {
      console.log('[deBridge Loader] Script found in DOM, waiting for SDK...');

      // Wait for SDK to be available
      const checkInterval = setInterval(() => {
        if (window.deBridge) {
          console.log('[deBridge Loader] SDK now available');
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.deBridge) {
          console.error('[deBridge Loader] Timeout waiting for SDK');
          reject(new Error('Timeout loading deBridge SDK'));
        }
      }, 10000);

      return;
    }

    // Create and load script
    console.log('[deBridge Loader] Loading SDK script...');
    const script = document.createElement('script');
    script.src = 'https://app.debridge.finance/assets/scripts/widget.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('[deBridge Loader] Script loaded, waiting for SDK initialization...');

      // Give SDK time to initialize
      setTimeout(() => {
        if (window.deBridge) {
          console.log('[deBridge Loader] SDK initialized successfully');
          resolve();
        } else {
          console.error('[deBridge Loader] SDK not available after script load');
          reject(new Error('deBridge SDK not available after script load'));
        }
      }, 500);
    };

    script.onerror = (error) => {
      console.error('[deBridge Loader] Failed to load script:', error);
      loadPromise = null; // Reset so it can be retried
      reject(new Error('Failed to load deBridge script'));
    };

    document.body.appendChild(script);
  });

  return loadPromise;
};

export const initializeDeBridgeWidget = async (config: any): Promise<void> => {
  try {
    // Ensure SDK is loaded
    await loadDeBridgeSDK();

    if (!window.deBridge) {
      throw new Error('deBridge SDK not available');
    }

    console.log('[deBridge Widget] Initializing with config:', config);
    window.deBridge.widget(config);
    console.log('[deBridge Widget] Widget initialized successfully');
  } catch (error) {
    console.error('[deBridge Widget] Failed to initialize:', error);
    throw error;
  }
};