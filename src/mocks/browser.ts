// This file configures and initializes the MSW service worker
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/locations';

// Create a worker instance with our request handlers
const worker = setupWorker();

// Register all request handlers
handlers.forEach(handler => worker.use(handler));

// Export the worker instance for programmatic access
export { worker };

// Start the worker when imported
worker.start({
  onUnhandledRequest: 'bypass'
});
