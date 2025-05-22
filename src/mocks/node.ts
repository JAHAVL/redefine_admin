import { setupServer } from 'msw/node';
import { locationHandlers } from './handlers/locations';

export const server = setupServer(...locationHandlers);
