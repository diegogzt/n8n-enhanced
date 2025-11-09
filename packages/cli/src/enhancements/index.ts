/**
 * N8N Enhanced Features Configuration
 * ===================================
 *
 * Este módulo proporciona configuraciones y funciones para extender
 * la funcionalidad de n8n Community Edition con features de Enterprise.
 *
 * Características incluidas:
 * - Extended workflow history retention
 * - External secrets provider integration
 * - SSO/OIDC authentication
 * - Workflow sharing and permissions
 * - Datadog/ELK logging integration
 *
 * Ubicación: packages/cli/src/enhancements/index.ts
 */

import { config } from 'dotenv';

// Cargar variables de entorno
config();

// ============================================
// 1. EXTENDED WORKFLOW HISTORY CONFIGURATION
// ============================================

export const WorkflowHistoryConfig = {
	/**
	 * Número de días a retener el historial de cambios en workflows
	 * Por defecto en Community: 1 día
	 * Rango recomendado: 1-90 días
	 */
	RETENTION_DAYS: parseInt(process.env.WORKFLOW_HISTORY_DAYS || '30', 10),

	/**
	 * Ejecutar limpieza automática de historial antiguo
	 */
	AUTO_CLEANUP_ENABLED: process.env.WORKFLOW_HISTORY_AUTO_CLEANUP !== 'false',

	/**
	 * Intervalo en horas para ejecutar la limpieza automática
	 */
	CLEANUP_INTERVAL_HOURS: parseInt(process.env.WORKFLOW_HISTORY_CLEANUP_INTERVAL || '6', 10),

	/**
	 * Máximo número de versiones a mantener por workflow
	 */
	MAX_VERSIONS_PER_WORKFLOW: parseInt(process.env.WORKFLOW_HISTORY_MAX_VERSIONS || '100', 10),
};

// ============================================
// 2. EXTERNAL SECRETS PROVIDER CONFIGURATION
// ============================================

export const ExternalSecretsConfig = {
	/**
	 * Proveedor de secretos a usar
	 * Opciones: 'vault', 'aws-secrets', 'azure-keyvault', 'local'
	 */
	PROVIDER: process.env.EXTERNAL_SECRETS_PROVIDER || 'local',

	/**
	 * HashiCorp Vault configuration
	 */
	VAULT: {
		ENABLED: process.env.VAULT_ADDR ? true : false,
		ADDRESS: process.env.VAULT_ADDR || '',
		TOKEN: process.env.VAULT_TOKEN || '',
		ENGINE: process.env.VAULT_SECRETS_ENGINE || 'secret',
		CREDENTIALS_PATH: process.env.VAULT_CREDENTIALS_PATH || 'n8n/credentials',
		FALLBACK_TO_LOCAL: process.env.VAULT_FALLBACK_ENABLED !== 'false',
		CACHE_TTL_SECONDS: parseInt(process.env.VAULT_CACHE_TTL || '300', 10),
	},

	/**
	 * AWS Secrets Manager configuration
	 */
	AWS: {
		ENABLED: process.env.AWS_REGION ? true : false,
		REGION: process.env.AWS_REGION || '',
		SECRET_PREFIX: process.env.AWS_SECRETS_PREFIX || 'n8n/',
		ROLE_ARN: process.env.AWS_ROLE_ARN || '',
	},

	/**
	 * Azure Key Vault configuration
	 */
	AZURE: {
		ENABLED: process.env.AZURE_VAULT_URL ? true : false,
		VAULT_URL: process.env.AZURE_VAULT_URL || '',
		TENANT_ID: process.env.AZURE_TENANT_ID || '',
		CLIENT_ID: process.env.AZURE_CLIENT_ID || '',
		CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET || '',
	},
};

// ============================================
// 3. SSO / OIDC AUTHENTICATION CONFIGURATION
// ============================================

export const SSOConfig = {
	/**
	 * Estrategias de SSO habilitadas
	 */
	STRATEGIES: {
		OIDC: {
			ENABLED: process.env.OIDC_ISSUER ? true : false,
			ISSUER: process.env.OIDC_ISSUER || '',
			CLIENT_ID: process.env.OIDC_CLIENT_ID || '',
			CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET || '',
			SCOPES: (process.env.OIDC_SCOPES || 'openid,profile,email').split(','),
			AUTO_CREATE_USERS: process.env.OIDC_AUTO_CREATE_USERS !== 'false',
		},

		SAML: {
			ENABLED: process.env.SAML_ENTRY_POINT ? true : false,
			ENTRY_POINT: process.env.SAML_ENTRY_POINT || '',
			ISSUER: process.env.SAML_ISSUER || '',
			CERT: process.env.SAML_CERT || '',
			PRIVATE_KEY: process.env.SAML_PRIVATE_KEY || '',
		},

		LDAP: {
			ENABLED: process.env.LDAP_SERVER ? true : false,
			SERVER: process.env.LDAP_SERVER || '',
			PORT: parseInt(process.env.LDAP_PORT || '389', 10),
			BASE_DN: process.env.LDAP_BASE_DN || '',
			BIND_DN: process.env.LDAP_BIND_DN || '',
			BIND_PASSWORD: process.env.LDAP_BIND_PASSWORD || '',
			USER_SEARCH_BASE: process.env.LDAP_USER_SEARCH_BASE || '',
			USER_SEARCH_FILTER: process.env.LDAP_USER_SEARCH_FILTER || '(uid={{username}})',
		},
	},

	/**
	 * Configuración general de SSO
	 */
	ALLOW_LOCAL_LOGIN: process.env.SSO_ALLOW_LOCAL_LOGIN !== 'false',
	REDIRECT_AFTER_LOGIN: process.env.SSO_REDIRECT_URL || '/workflows',
};

// ============================================
// 4. WORKFLOW SHARING & PERMISSIONS
// ============================================

export const SharingConfig = {
	/**
	 * Habilitar compartición de workflows entre usuarios
	 */
	ENABLED: process.env.WORKFLOW_SHARING_ENABLED !== 'false',

	/**
	 * Roles disponibles para compartición
	 * - viewer: solo lectura
	 * - editor: puede editar
	 * - owner: propietario completo
	 */
	ALLOWED_ROLES: ['viewer', 'editor', 'owner'],

	/**
	 * Permitir compartición pública (requiere URL pública)
	 */
	ALLOW_PUBLIC_SHARING: process.env.WORKFLOW_PUBLIC_SHARING === 'true',

	/**
	 * Requireautenticación para ver workflows compartidos públicamente
	 */
	PUBLIC_SHARING_REQUIRES_AUTH: process.env.PUBLIC_SHARING_REQUIRES_AUTH !== 'false',

	/**
	 * Habilitar credenciales compartidas
	 */
	ALLOW_SHARED_CREDENTIALS: process.env.SHARED_CREDENTIALS_ENABLED === 'true',
};

// ============================================
// 5. LOGGING & MONITORING CONFIGURATION
// ============================================

export const LoggingConfig = {
	/**
	 * Datadog integration
	 */
	DATADOG: {
		ENABLED: process.env.DATADOG_API_KEY ? true : false,
		API_KEY: process.env.DATADOG_API_KEY || '',
		HOSTNAME: process.env.DATADOG_HOSTNAME || 'n8n-instance',
		ENVIRONMENT: process.env.DATADOG_ENVIRONMENT || process.env.NODE_ENV || 'development',
		SERVICE: process.env.DATADOG_SERVICE || 'n8n',
		LOG_INFO: process.env.DATADOG_LOG_INFO !== 'false',
	},

	/**
	 * ELK Stack (Elasticsearch, Logstash, Kibana)
	 */
	ELK: {
		ENABLED: process.env.ELASTICSEARCH_NODE ? true : false,
		NODE: process.env.ELASTICSEARCH_NODE || '',
		USERNAME: process.env.ELASTICSEARCH_USERNAME || '',
		PASSWORD: process.env.ELASTICSEARCH_PASSWORD || '',
		INDEX: process.env.ELASTICSEARCH_INDEX || 'n8n-logs',
		INDEX_PATTERN: process.env.ELASTICSEARCH_INDEX_PATTERN || 'n8n-logs-%DATE%',
	},

	/**
	 * Splunk integration
	 */
	SPLUNK: {
		ENABLED: process.env.SPLUNK_HEC_URL ? true : false,
		HEC_URL: process.env.SPLUNK_HEC_URL || '',
		HEC_TOKEN: process.env.SPLUNK_HEC_TOKEN || '',
		SOURCE: process.env.SPLUNK_SOURCE || 'n8n',
		SOURCETYPE: process.env.SPLUNK_SOURCETYPE || 'n8n:logs',
	},

	/**
	 * Configuración general de logs
	 */
	LEVEL: process.env.LOG_LEVEL || 'info',
	FORMAT: process.env.LOG_FORMAT || 'json',
	RETENTION_DAYS: parseInt(process.env.LOG_RETENTION_DAYS || '30', 10),
};

// ============================================
// 6. INFRASTRUCTURE CONFIGURATION
// ============================================

export const InfrastructureConfig = {
	/**
	 * Queue Mode (para escalabilidad horizontal)
	 */
	QUEUE_MODE: {
		ENABLED: process.env.EXECUTION_MODE === 'queue',
		MODE: process.env.EXECUTION_MODE || 'regular',
		REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
	},

	/**
	 * Database configuration
	 */
	DATABASE: {
		TYPE: process.env.DB_TYPE || 'sqlite',
		HOST: process.env.DB_HOST || 'localhost',
		PORT: parseInt(process.env.DB_PORT || '5432', 10),
		NAME: process.env.DB_NAME || 'n8n',
		USER: process.env.DB_USER || 'n8n',
		PASSWORD: process.env.DB_PASSWORD || '',
		POOL_SIZE: parseInt(process.env.DB_POOL_SIZE || '10', 10),
	},

	/**
	 * Binary data storage
	 */
	BINARY_DATA: {
		MODE: process.env.BINARY_DATA_MODE || 'filesystem',
		S3_BUCKET: process.env.S3_BUCKET || '',
		S3_REGION: process.env.S3_REGION || 'us-east-1',
		S3_ENDPOINT: process.env.S3_ENDPOINT || '',
		AZURE_CONTAINER: process.env.AZURE_CONTAINER || '',
	},
};

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Validar configuración al iniciar
 */
export function validateConfiguration(): string[] {
	const errors: string[] = [];

	// Validar Vault si está habilitado
	if (ExternalSecretsConfig.VAULT.ENABLED && !ExternalSecretsConfig.VAULT.TOKEN) {
		errors.push('VAULT_TOKEN no configurado pero VAULT_ADDR está definido');
	}

	// Validar OIDC si está habilitado
	if (SSOConfig.STRATEGIES.OIDC.ENABLED) {
		if (!SSOConfig.STRATEGIES.OIDC.CLIENT_ID) {
			errors.push('OIDC_CLIENT_ID no configurado');
		}
		if (!SSOConfig.STRATEGIES.OIDC.CLIENT_SECRET) {
			errors.push('OIDC_CLIENT_SECRET no configurado');
		}
	}

	// Validar Datadog si está habilitado
	if (LoggingConfig.DATADOG.ENABLED && !LoggingConfig.DATADOG.API_KEY) {
		errors.push('DATADOG_API_KEY no configurado pero DATADOG está habilitado');
	}

	return errors;
}

/**
 * Imprimir configuración (para debugging)
 */
export function printConfiguration(): void {
	console.log('\n=== N8N Enhanced Features Configuration ===\n');

	console.log('Workflow History:');
	console.log(`  - Retention Days: ${WorkflowHistoryConfig.RETENTION_DAYS}`);
	console.log(`  - Auto Cleanup: ${WorkflowHistoryConfig.AUTO_CLEANUP_ENABLED}`);

	console.log('\nExternal Secrets:');
	console.log(`  - Provider: ${ExternalSecretsConfig.PROVIDER}`);
	console.log(`  - Vault: ${ExternalSecretsConfig.VAULT.ENABLED}`);
	console.log(`  - AWS: ${ExternalSecretsConfig.AWS.ENABLED}`);
	console.log(`  - Azure: ${ExternalSecretsConfig.AZURE.ENABLED}`);

	console.log('\nSSO/Authentication:');
	console.log(`  - OIDC: ${SSOConfig.STRATEGIES.OIDC.ENABLED}`);
	console.log(`  - SAML: ${SSOConfig.STRATEGIES.SAML.ENABLED}`);
	console.log(`  - LDAP: ${SSOConfig.STRATEGIES.LDAP.ENABLED}`);

	console.log('\nSharing:');
	console.log(`  - Enabled: ${SharingConfig.ENABLED}`);
	console.log(`  - Public Sharing: ${SharingConfig.ALLOW_PUBLIC_SHARING}`);

	console.log('\nLogging:');
	console.log(`  - Datadog: ${LoggingConfig.DATADOG.ENABLED}`);
	console.log(`  - ELK: ${LoggingConfig.ELK.ENABLED}`);
	console.log(`  - Splunk: ${LoggingConfig.SPLUNK.ENABLED}`);

	console.log('\nInfrastructure:');
	console.log(`  - Execution Mode: ${InfrastructureConfig.QUEUE_MODE.MODE}`);
	console.log(`  - Database: ${InfrastructureConfig.DATABASE.TYPE}`);
	console.log(`  - Binary Data Mode: ${InfrastructureConfig.BINARY_DATA.MODE}`);

	console.log('\n');
}

// Validar y mostrar configuración al importar
const errors = validateConfiguration();
if (errors.length > 0) {
	console.warn('⚠️  Errores de configuración:');
	errors.forEach((error) => console.warn(`  - ${error}`));
}

if (process.env.DEBUG_N8N_CONFIG === 'true') {
	printConfiguration();
}

export default {
	WorkflowHistoryConfig,
	ExternalSecretsConfig,
	SSOConfig,
	SharingConfig,
	LoggingConfig,
	InfrastructureConfig,
	validateConfiguration,
	printConfiguration,
};
