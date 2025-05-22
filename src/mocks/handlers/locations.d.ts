import type { RequestHandler } from 'msw';

declare const locationHandlers: RequestHandler[];
declare const handlers: RequestHandler[];

export { locationHandlers, handlers };
