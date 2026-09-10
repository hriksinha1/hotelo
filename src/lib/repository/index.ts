import { repository as demoRepo } from './demo';
import { IRepository } from './types';

/**
 * Repository Provider
 * 
 * Bookzee uses a centralized IRepository interface.
 * Currently, demoRepo provides deterministic local storage state with full multi-tenant
 * data shapes (Properties, Bookings, Guests, Payments, Conversations, Requests, Stay Tokens).
 * 
 * Future Production Backend:
 * An AppwriteRepository (or other multi-tenant backend) will implement IRepository
 * without requiring changes to UI components or feature hooks.
 */
export const repository: IRepository = demoRepo;
export * from './types';
