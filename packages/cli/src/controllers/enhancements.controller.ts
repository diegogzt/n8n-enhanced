/**
 * ENHANCEMENT: Configuration endpoints for enhanced features
 */

import { Get, RestController } from '@n8n/decorators';

@RestController('/enhancements')
export class EnhancementsController {
	@Get('/workflow-history-config')
	async getWorkflowHistoryConfig() {
		const historyDays = parseInt(process.env.WORKFLOW_HISTORY_DAYS || '1', 10);
		return {
			enabled: true,
			maxDays: Math.min(historyDays, 90),
			currentRetention: `${historyDays} days`,
			configuredVia: 'WORKFLOW_HISTORY_DAYS',
		};
	}

	@Get('/external-secrets-config')
	async getExternalSecretsConfig() {
		const vaultAddr = process.env.VAULT_ADDR;
		return {
			vaultEnabled: !!vaultAddr,
			vaultUrl: vaultAddr || 'not-configured',
			credentialsPath: process.env.VAULT_CREDENTIALS_PATH || 'n8n/credentials',
			fallbackToDB: true,
		};
	}

	@Get('/oidc-config')
	async getOidcConfig() {
		const oidcEnabled = !!process.env.OIDC_ISSUER;
		return {
			oidcEnabled,
			issuer: process.env.OIDC_ISSUER || 'not-configured',
			clientId: process.env.OIDC_CLIENT_ID ? 'configured' : 'not-configured',
			autoCreateUsers: process.env.OIDC_AUTO_CREATE_USERS !== 'false',
		};
	}

	@Get('/datadog-config')
	async getDatadogConfig() {
		const datadogEnabled = !!process.env.DATADOG_API_KEY;
		return {
			datadogEnabled,
			apiKeyConfigured: datadogEnabled,
			endpoint: 'http-intake.logs.datadoghq.com/v1/input',
			service: 'n8n',
		};
	}
}
