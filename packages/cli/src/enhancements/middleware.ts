/**
 * ENHANCEMENT: Extension Middleware for n8n Community Edition
 * Registers configuration endpoints for all enhanced features
 */

import type { Request, Response } from 'express';
import { Logger } from '@n8n/backend-common';
import { Container } from '@n8n/di';

export function setupExtensionRoutes(app: any): void {
	const logger = Container.get(Logger);

	// Extended Workflow History Configuration
	app.get('/api/v1/workflows/history-config', (_req: Request, res: Response) => {
		const historyDays = parseInt(process.env.WORKFLOW_HISTORY_DAYS || '1', 10);
		res.json({
			enabled: true,
			maxDays: Math.min(historyDays, 90),
			currentRetention: `${historyDays} days`,
			configuredVia: 'WORKFLOW_HISTORY_DAYS',
		});
	});

	// External Secrets (Vault) Configuration
	app.get('/api/v1/credentials/external-secrets-config', (_req: Request, res: Response) => {
		const vaultAddr = process.env.VAULT_ADDR;
		res.json({
			vaultEnabled: !!vaultAddr,
			vaultUrl: vaultAddr || 'not-configured',
			credentialsPath: process.env.VAULT_CREDENTIALS_PATH || 'n8n/credentials',
			fallbackToDB: true,
		});
	});

	// OIDC Authentication Configuration
	app.get('/api/v1/auth/oidc-config', (_req: Request, res: Response) => {
		const oidcEnabled = !!process.env.OIDC_ISSUER;
		res.json({
			oidcEnabled,
			issuer: process.env.OIDC_ISSUER || 'not-configured',
			clientId: process.env.OIDC_CLIENT_ID ? 'configured' : 'not-configured',
			autoCreateUsers: process.env.OIDC_AUTO_CREATE_USERS !== 'false',
		});
	});

	// Datadog Logging Configuration
	app.get('/api/v1/logging/datadog-config', (_req: Request, res: Response) => {
		const datadogEnabled = !!process.env.DATADOG_API_KEY;
		res.json({
			datadogEnabled,
			apiKeyConfigured: datadogEnabled,
			endpoint: 'http-intake.logs.datadoghq.com/v1/input',
			service: 'n8n',
		});
	});

	logger.info('[Extensions] Configuration endpoints registered');
}

export function setupExtensionMiddleware(app: any): void {
	const logger = Container.get(Logger);

	// Logging middleware for extension endpoints
	app.use((_req: Request, _res: Response, next: any) => {
		// In production, this would log extension endpoint access
		next();
	});

	logger.info('[Extensions] Middleware configured');
}

export function logExtensionCapabilities(): void {
	const logger = Container.get(Logger);

	const features = {
		workflowHistory: !!process.env.WORKFLOW_HISTORY_DAYS,
		datadog: !!process.env.DATADOG_API_KEY,
		vault: !!process.env.VAULT_ADDR,
		oidc: !!process.env.OIDC_ISSUER,
	};

	logger.info('[Extensions] Enhanced features available', features);

	// Log specific configurations
	if (features.workflowHistory) {
		logger.info('[Extensions] Workflow History', {
			days: process.env.WORKFLOW_HISTORY_DAYS,
		});
	}

	if (features.datadog) {
		logger.info('[Extensions] Datadog Logging enabled');
	}

	if (features.vault) {
		logger.info('[Extensions] HashiCorp Vault', {
			addr: process.env.VAULT_ADDR,
			path: process.env.VAULT_CREDENTIALS_PATH || 'n8n/credentials',
		});
	}

	if (features.oidc) {
		logger.info('[Extensions] OIDC/SSO', {
			issuer: process.env.OIDC_ISSUER,
			autoCreateUsers: process.env.OIDC_AUTO_CREATE_USERS !== 'false',
		});
	}
}

export default {
	setupExtensionRoutes,
	setupExtensionMiddleware,
	logExtensionCapabilities,
};
