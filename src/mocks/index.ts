// This file initializes the mock service worker in the browser
// It's conditionally imported in the app's entry point

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./browser');
  
  // Start the mock service worker with error handling
  const startMockServiceWorker = async () => {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: false, // Enable logging for debugging
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
      console.log('[MSW] Mock server is running');
    } catch (error) {
      console.error('[MSW] Failed to start mock server', error);
    }
  };
  
  // Start the worker
  startMockServiceWorker();
}

export {};
