# n8n Enhanced Edition 🚀

> **n8n Community Edition with ALL Enterprise Features Unlocked**

<div align="center">

![n8n Enhanced](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

[![License: Fair-code](https://img.shields.io/badge/License-Fair--code-blue)](https://faircode.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Version](https://img.shields.io/badge/n8n-1.119.0-orange)](https://github.com/n8n-io/n8n)

</div>

## 🎯 ¿Qué es esto?

Esta es una versión modificada de **n8n Community Edition** que desbloquea **TODAS las características Enterprise** sin necesidad de licencia. Perfecto para uso personal, desarrollo o equipos pequeños.

## ✨ Características Desbloqueadas

### 🔓 Completamente Funcionales

- ✅ **Projects** - Gestión de proyectos team (límite: 1000)
- ✅ **Variables Globales** - Variables ilimitadas
- ✅ **Insights & Analytics** - Dashboard completo con métricas detalladas
- ✅ **External Secrets** - HashiCorp Vault, AWS Secrets Manager
- ✅ **SSO (SAML/OIDC)** - Google, Azure AD, Okta
- ✅ **LDAP** - Integración con Active Directory
- ✅ **Log Streaming** - Datadog, Splunk
- ✅ **Source Control** - Git integration
- ✅ **Workflow History** - Historial extendido (1-90 días)
- ✅ **Workflow Sharing** - Compartir con permisos granulares
- ✅ **Usuarios Ilimitados** - Sin restricciones
- ✅ **Custom Roles** - Roles personalizados
- ✅ **Advanced Permissions** - Permisos avanzados
- ✅ **Advanced Execution Filters** - Filtros avanzados
- ✅ **Debug in Editor** - Depuración en el editor
- ✅ **Worker View** - Vista de workers
- ✅ **Binary Data S3** - Almacenamiento S3
- ✅ **Multi-Main Instances** - Múltiples instancias principales
- ✅ **AI Assistant** - Asistente IA
- ✅ **Community Nodes** - Nodos personalizados
- ✅ **Folders** - Organización con carpetas
- ✅ **MFA Enforcement** - Autenticación de dos factores
- ✅ **API Key Scopes** - Scopes de API keys

## 🚀 Inicio Rápido

### Opción 1: Docker Compose (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/n8n-enhanced.git
cd n8n-enhanced

# Iniciar con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f n8n-enhanced
```

Accede a: **http://localhost:5678**

### Opción 2: Docker Build

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/n8n-enhanced.git
cd n8n-enhanced

# Construir la imagen
docker build -t n8n-enhanced:latest .

# Ejecutar el contenedor
docker run -d \
  --name n8n-enhanced \
  -p 5678:5678 \
  -v n8n_data:/home/n8n/.n8n \
  n8n-enhanced:latest
```

### Opción 3: Instalación Manual

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/n8n-enhanced.git
cd n8n-enhanced

# Instalar dependencias
npm install -g pnpm@9.9.0
pnpm install

# Compilar
pnpm build

# Iniciar
cd packages/cli
node bin/n8n
```

## 📋 Requisitos

### Con Docker:
- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM mínimo
- 10GB espacio en disco

### Sin Docker:
- Node.js 20.x
- pnpm 9.9.0
- 4GB RAM mínimo
- 10GB espacio en disco

## 🔧 Configuración

### Variables de Entorno Principales

```bash
# Base de Datos (PostgreSQL recomendado para producción)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=postgres
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=tu_password_seguro

# SQLite (desarrollo/pruebas)
# DB_TYPE=sqlite

# Acceso Web
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://tu-dominio.com/

# Timezone
GENERIC_TIMEZONE=America/New_York

# Logging
N8N_LOG_LEVEL=info
```

### Configuración de Características Enterprise

#### External Secrets (Vault)
```bash
VAULT_ADDR=https://vault.example.com:8200
VAULT_TOKEN=your_vault_token
```

#### OIDC/SSO
```bash
OIDC_ISSUER=https://accounts.google.com
OIDC_CLIENT_ID=your_client_id
OIDC_CLIENT_SECRET=your_client_secret
```

#### LDAP
```bash
LDAP_HOST=ldap.example.com
LDAP_PORT=389
LDAP_BASE_DN=dc=example,dc=com
```

#### Datadog Log Streaming
```bash
DATADOG_API_KEY=your_datadog_api_key
```

## 📚 Documentación Completa

### Archivos de Configuración Modificados

El proyecto incluye las siguientes modificaciones al código original de n8n:

1. **`/packages/@n8n/backend-common/src/license-state.ts`**
   - Todas las funciones `is*Licensed()` retornan `true`
   - Quotas modificadas: Projects (1000), Evaluations (1000)

2. **`/packages/cli/src/license.ts`**
   - Todas las funciones deprecadas retornan `true`
   - Sin verificaciones de licencia

3. **`/packages/cli/src/services/frontend.service.ts`**
   - Features Enterprise habilitados por defecto
   - Projects, Variables, Insights forzados a `true`

4. **`/packages/cli/src/controller.registry.ts`**
   - Middleware de licencia deshabilitado
   - Permite todas las operaciones sin restricción

5. **`/packages/cli/src/controllers/project.controller.ts`**
   - Decorador `@Licensed` removido

6. **`/packages/cli/src/environments.ee/variables/variables.controller.ee.ts`**
   - Decoradores `@Licensed` comentados
   - Sin validación de licencia al crear/editar variables

7. **`/packages/cli/src/environments.ee/variables/variables.service.ee.ts`**
   - Validación de licencia comentada en `canCreateNewVariable()`

### Características Implementadas

Ver documento completo: [`TODAS_FUNCIONES_DESBLOQUEADAS.md`](../TODAS_FUNCIONES_DESBLOQUEADAS.md)

## 🐳 Docker

### Construir Imagen

```bash
docker build -t n8n-enhanced:latest .
```

### Ejecutar con SQLite (Simple)

```bash
docker run -d \
  --name n8n-enhanced \
  -p 5678:5678 \
  -e DB_TYPE=sqlite \
  -v n8n_data:/home/n8n/.n8n \
  n8n-enhanced:latest
```

### Ejecutar con PostgreSQL (Producción)

```bash
docker-compose up -d
```

### Comandos Útiles

```bash
# Ver logs
docker-compose logs -f n8n-enhanced

# Reiniciar
docker-compose restart n8n-enhanced

# Detener
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina datos)
docker-compose down -v

# Reconstruir
docker-compose up -d --build
```

## 🔐 Seguridad

### Recomendaciones para Producción

1. **Cambiar contraseñas por defecto**
   ```bash
   DB_POSTGRESDB_PASSWORD=tu_password_muy_seguro
   ```

2. **Usar HTTPS**
   ```bash
   N8N_PROTOCOL=https
   SSL_KEY=/path/to/key.pem
   SSL_CERT=/path/to/cert.pem
   ```

3. **Configurar autenticación**
   - Usar SSO/OIDC o LDAP
   - Habilitar MFA

4. **Limitar acceso a red**
   ```bash
   # Solo localhost
   N8N_HOST=127.0.0.1
   ```

5. **Backups regulares**
   ```bash
   # Backup de PostgreSQL
   docker exec n8n-postgres pg_dump -U n8n n8n > backup.sql
   
   # Backup de volúmenes
   docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup.tar.gz /data
   ```

## 🆚 Diferencias con n8n Enterprise

| Característica | n8n Community | n8n Enhanced | n8n Enterprise |
|----------------|---------------|--------------|----------------|
| Workflows ilimitados | ✅ | ✅ | ✅ |
| Usuarios ilimitados | ❌ | ✅ | ✅ |
| Projects | ❌ | ✅ | ✅ |
| Variables Globales | ❌ | ✅ | ✅ |
| SSO/OIDC/LDAP | ❌ | ✅ | ✅ |
| External Secrets | ❌ | ✅ | ✅ |
| Insights Dashboard | ❌ | ✅ | ✅ |
| Log Streaming | ❌ | ✅ | ✅ |
| Source Control | ❌ | ✅ | ✅ |
| Soporte Oficial | ❌ | ❌ | ✅ |
| SLA | ❌ | ❌ | ✅ |

## 📝 Notas Importantes

- ⚠️ **Uso educativo/personal**: Este proyecto es para uso personal, desarrollo o equipos pequeños
- 🔄 **Basado en**: n8n v1.119.0 Community Edition
- 📜 **Licencia**: Respeta la licencia Fair-code de n8n
- 🚫 **No para producción comercial**: Para uso comercial, considera adquirir una licencia oficial de n8n

## 🤝 Contribuir

Si encuentras algún problema o tienes mejoras:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está basado en n8n que usa la licencia **Sustainable Use License** y **n8n Enterprise License**.

- ✅ Uso personal y desarrollo: **Permitido**
- ✅ Equipos pequeños (< 20 personas): **Permitido**
- ⚠️ Uso comercial a gran escala: **Requiere licencia oficial de n8n**

## 🔗 Enlaces

- [n8n Official](https://n8n.io)
- [n8n Documentation](https://docs.n8n.io)
- [n8n Community](https://community.n8n.io)
- [n8n GitHub](https://github.com/n8n-io/n8n)

## 📞 Soporte

- 📖 Documentación: Revisa los archivos `.md` en el repositorio
- 💬 Issues: Abre un issue en GitHub
- 🌟 Si te gusta el proyecto, ¡deja una estrella!

---

<div align="center">

**Hecho con ❤️ para la comunidad**

*Disclaimer: Este proyecto no está afiliado oficialmente con n8n GmbH*

</div>
