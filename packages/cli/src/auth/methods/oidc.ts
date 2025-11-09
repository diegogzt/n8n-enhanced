/**
 * OIDC Authentication Method
 * ENHANCEMENT: Support OIDC/OAuth2 authentication for Community Edition
 *
 * Permite autenticación con Azure AD, Okta, Google Workspace, etc.
 *
 * Variables de entorno requeridas:
 * - OIDC_ISSUER: URL del proveedor OIDC
 * - OIDC_CLIENT_ID: Client ID
 * - OIDC_CLIENT_SECRET: Client Secret
 */

import type { Request, Response, NextFunction } from 'express';
import { Logger } from '@n8n/backend-common';
import { Service } from '@n8n/di';

export interface OIDCUser {
	sub: string;
	email?: string;
	name?: string;
	given_name?: string;
	family_name?: string;
	picture?: string;
	email_verified?: boolean;
}

@Service()
export class OIDCAuthMethod {
	private enabled: boolean;

	constructor(private readonly logger: Logger) {
		this.enabled = !!process.env.OIDC_ISSUER;

		if (this.enabled) {
			this.logger.info('[OIDC Auth] Method initialized', {
				issuer: process.env.OIDC_ISSUER,
				autoCreateUsers: process.env.OIDC_AUTO_CREATE_USERS !== 'false',
			});
		}
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	/**
	 * Procesar respuesta de OIDC
	 * En una implementación completa, esto crearía/actualizaría el usuario
	 */
	async handleOIDCCallback(profile: OIDCUser): Promise<{ userId: string; email: string } | null> {
		if (!this.enabled) {
			return null;
		}

		try {
			// Log del perfil OIDC recibido
			this.logger.debug('[OIDC Auth] Processing OIDC profile', {
				sub: profile.sub,
				email: profile.email,
				name: profile.name,
			});

			// En implementación completa:
			// 1. Buscar usuario por email
			// 2. Crear usuario si OIDC_AUTO_CREATE_USERS=true
			// 3. Actualizar último login
			// 4. Crear sesión

			return {
				userId: `oidc-${profile.sub}`,
				email: profile.email || '',
			};
		} catch (error) {
			this.logger.error('[OIDC Auth] Error processing OIDC callback', {
				error: error instanceof Error ? error.message : String(error),
				sub: profile.sub,
			});

			return null;
		}
	}

	/**
	 * Middleware para verificar si hay token OIDC
	 */
	middleware() {
		return (_req: Request, _res: Response, next: NextFunction) => {
			// Verificar si OIDC está habilitado
			if (!this.enabled) {
				return next();
			}

			// En implementación completa:
			// - Validar token OIDC
			// - Adjuntar usuario a la request
			// - Crear/actualizar sesión

			next();
		};
	}

	/**
	 * Obtener configuración de OIDC para el cliente
	 */
	getConfig() {
		return {
			enabled: this.enabled,
			issuer: process.env.OIDC_ISSUER || '',
			clientId: process.env.OIDC_CLIENT_ID || '',
			scopes: (process.env.OIDC_SCOPES || 'openid,profile,email').split(','),
			autoCreateUsers: process.env.OIDC_AUTO_CREATE_USERS !== 'false',
		};
	}
}
