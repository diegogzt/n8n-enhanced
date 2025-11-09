import 'array.prototype.tosorted';
import { v4 as uuid } from 'uuid';

// Polyfill crypto.randomUUID
// Handle both secure (HTTPS) and non-secure (HTTP) contexts
try {
	if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
		Object.defineProperty(crypto, 'randomUUID', { value: uuid });
	}
} catch (error) {
	// In case crypto is not accessible, create a global fallback
	if (typeof window !== 'undefined') {
		(window as any).crypto = (window as any).crypto || {};
		(window as any).crypto.randomUUID = uuid;
	}
}
