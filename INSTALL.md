# 🚀 Guía de Instalación - n8n Enhanced Edition

## 📋 Tabla de Contenidos

- [Instalación con Docker Compose (Recomendado)](#instalación-con-docker-compose-recomendado)
- [Instalación con Docker](#instalación-con-docker)
- [Instalación Manual](#instalación-manual)
- [Configuración Post-Instalación](#configuración-post-instalación)
- [Verificación](#verificación)
- [Troubleshooting](#troubleshooting)

---

## 📦 Instalación con Docker Compose (Recomendado)

### Requisitos Previos

- Docker 20.10 o superior
- Docker Compose v2.0 o superior
- 4GB RAM mínimo (8GB recomendado)
- 10GB espacio en disco

### Pasos de Instalación

#### 1. Clonar el repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/n8n-enhanced.git
cd n8n-enhanced
```

#### 2. Configurar variables de entorno (opcional)

Crea un archivo `.env` si deseas personalizar la configuración:

```bash
cat > .env << 'EOF'
# Database
POSTGRES_USER=n8n
POSTGRES_PASSWORD=n8n_secure_password_change_me
POSTGRES_DB=n8n

# n8n Basic
N8N_BASIC_AUTH_ACTIVE=false
N8N_ENCRYPTION_KEY=your_encryption_key_min_24_chars

# Timezone
GENERIC_TIMEZONE=America/New_York
TZ=America/New_York

# Security
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
N8N_BLOCK_ENV_ACCESS_IN_NODE=false

# Optional: External URL (for webhooks)
WEBHOOK_URL=https://your-domain.com
N8N_HOST=your-domain.com
N8N_PROTOCOL=https
EOF
```

#### 3. Iniciar los servicios

```bash
# Iniciar en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f n8n-enhanced

# Verificar estado
docker-compose ps
```

#### 4. Acceder a n8n

Abre tu navegador en: **http://localhost:5678**

---

## 🐳 Instalación con Docker (Sin Compose)

### Paso 1: Crear red y volúmenes

```bash
# Crear red
docker network create n8n-network

# Crear volúmenes
docker volume create n8n_data
docker volume create n8n_files
docker volume create postgres_data
```

### Paso 2: Iniciar PostgreSQL

```bash
docker run -d \
  --name n8n-postgres \
  --network n8n-network \
  -e POSTGRES_USER=n8n \
  -e POSTGRES_PASSWORD=n8n_secure_password \
  -e POSTGRES_DB=n8n \
  -v postgres_data:/var/lib/postgresql/data \
  --health-cmd="pg_isready -U n8n" \
  --health-interval=10s \
  --health-timeout=5s \
  --health-retries=5 \
  postgres:16-alpine
```

### Paso 3: Construir imagen de n8n Enhanced

```bash
# Clonar repositorio si no lo has hecho
git clone https://github.com/tuusuario/n8n-enhanced.git
cd n8n-enhanced

# Construir imagen
docker build -t n8n-enhanced:latest .
```

### Paso 4: Iniciar n8n Enhanced

```bash
docker run -d \
  --name n8n-enhanced \
  --network n8n-network \
  -p 5678:5678 \
  -e DB_TYPE=postgresdb \
  -e DB_POSTGRESDB_HOST=n8n-postgres \
  -e DB_POSTGRESDB_PORT=5432 \
  -e DB_POSTGRESDB_DATABASE=n8n \
  -e DB_POSTGRESDB_USER=n8n \
  -e DB_POSTGRESDB_PASSWORD=n8n_secure_password \
  -e GENERIC_TIMEZONE=America/New_York \
  -e TZ=America/New_York \
  -v n8n_data:/home/n8n/.n8n \
  -v n8n_files:/home/n8n/.n8n/files \
  --restart unless-stopped \
  n8n-enhanced:latest
```

---

## 🔧 Instalación Manual (Desarrollo)

### Requisitos

- Node.js 20.x
- pnpm 9.9.0
- PostgreSQL 14+ (opcional, puede usar SQLite)
- Git

### Pasos

#### 1. Clonar y preparar

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/n8n-enhanced.git
cd n8n-enhanced

# Instalar pnpm si no lo tienes
npm install -g pnpm@9.9.0

# Instalar dependencias
pnpm install --frozen-lockfile
```

#### 2. Construir el proyecto

```bash
# Compilar todos los paquetes
pnpm build

# Verificar que no hay errores
echo $?  # Debe mostrar 0
```

#### 3. Configurar base de datos (opcional)

Si usas PostgreSQL:

```bash
# Crear base de datos
createdb n8n

# Configurar variables de entorno
export DB_TYPE=postgresdb
export DB_POSTGRESDB_HOST=localhost
export DB_POSTGRESDB_PORT=5432
export DB_POSTGRESDB_DATABASE=n8n
export DB_POSTGRESDB_USER=tu_usuario
export DB_POSTGRESDB_PASSWORD=tu_password
```

Si usas SQLite (por defecto):

```bash
# SQLite se crea automáticamente
export DB_TYPE=sqlite
export DB_SQLITE_DATABASE=/path/to/database.sqlite
```

#### 4. Iniciar n8n

```bash
# Modo desarrollo (con auto-reload)
pnpm dev

# O modo producción
cd packages/cli
node bin/n8n start
```

---

## ⚙️ Configuración Post-Instalación

### 1. Crear primer usuario administrador

Al acceder por primera vez a http://localhost:5678, se te pedirá crear una cuenta de administrador.

### 2. Habilitar características Enterprise

Todas las características ya están desbloqueadas. Verifica que puedes acceder a:

- **Settings → Projects** (crear hasta 1000 proyectos)
- **Settings → Variables** (crear variables globales ilimitadas)
- **Settings → Users** (invitar usuarios ilimitados)
- **Settings → External Secrets** (configurar Vault, AWS, Azure)
- **Settings → SSO/OIDC** (configurar Google, Azure AD, Okta)
- **Settings → LDAP** (integrar Active Directory)
- **Settings → Log Streaming** (Datadog, Splunk, Sentry)
- **Workflows → Insights** (ver analytics y evaluaciones)

### 3. Configurar OIDC (opcional)

```bash
# Agregar variables de entorno para Google OIDC
docker-compose stop n8n-enhanced

# Editar docker-compose.yml y agregar:
# - N8N_SSO_OIDC_ENABLED=true
# - N8N_SSO_OIDC_CLIENT_ID=tu_client_id
# - N8N_SSO_OIDC_CLIENT_SECRET=tu_client_secret
# - N8N_SSO_OIDC_ISSUER=https://accounts.google.com
# - N8N_SSO_OIDC_SCOPE=openid email profile

docker-compose up -d
```

### 4. Configurar External Secrets (opcional)

Para HashiCorp Vault:

```bash
# Editar docker-compose.yml y agregar:
# - N8N_EXTERNAL_SECRETS_VAULT_URL=https://vault.example.com
# - N8N_EXTERNAL_SECRETS_VAULT_TOKEN=hvs.xxxxx
# - N8N_EXTERNAL_SECRETS_VAULT_NAMESPACE=admin

docker-compose restart n8n-enhanced
```

### 5. Configurar Log Streaming a Datadog (opcional)

```bash
# Editar docker-compose.yml y agregar:
# - N8N_LOG_STREAM_DATADOG_API_KEY=tu_api_key
# - N8N_LOG_STREAM_DATADOG_SITE=datadoghq.com

docker-compose restart n8n-enhanced
```

---

## ✅ Verificación

### Verificar que n8n está corriendo

```bash
# Con Docker Compose
docker-compose ps

# Debería mostrar:
# NAME              STATUS        PORTS
# n8n-enhanced      Up            0.0.0.0:5678->5678/tcp
# postgres          Up (healthy)  5432/tcp
```

### Verificar logs

```bash
# Ver logs de n8n
docker-compose logs -f n8n-enhanced

# Deberías ver:
# ✅ n8n ready on ::, port 5678
# ✅ Editor is now accessible via: http://localhost:5678
```

### Verificar salud del contenedor

```bash
# Healthcheck
docker inspect n8n-enhanced | grep -A 10 Health

# Debería mostrar "healthy"
```

### Verificar características Enterprise

1. Abre http://localhost:5678
2. Ve a **Settings**
3. Verifica que aparecen las secciones:
   - ✅ Projects
   - ✅ Variables
   - ✅ External Secrets
   - ✅ SSO
   - ✅ LDAP
   - ✅ Log Streaming

---

## 🔍 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs --tail=100 n8n-enhanced

# Verificar puertos
lsof -i :5678  # macOS/Linux
netstat -ano | findstr :5678  # Windows

# Si hay conflicto, cambiar puerto en docker-compose.yml:
# ports:
#   - "5679:5678"  # Cambiar 5679 por el puerto que quieras
```

### Error "Plan lacks license for this feature"

Esto NO debería suceder en n8n Enhanced. Si lo ves:

1. Verifica que estás usando la imagen correcta:

   ```bash
   docker inspect n8n-enhanced | grep Image
   ```

2. Reconstruye la imagen:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Base de datos no se conecta

```bash
# Verificar que PostgreSQL está saludable
docker inspect n8n-postgres | grep -A 5 Health

# Reiniciar PostgreSQL
docker-compose restart postgres

# Esperar 10 segundos y reiniciar n8n
sleep 10
docker-compose restart n8n-enhanced
```

### Resetear la instalación

```bash
# ⚠️ CUIDADO: Esto borrará TODOS los datos

# Detener servicios
docker-compose down

# Eliminar volúmenes
docker volume rm n8n_data n8n_files postgres_data

# Volver a iniciar
docker-compose up -d
```

### Performance lento

```bash
# Aumentar recursos en docker-compose.yml:

services:
  n8n-enhanced:
    deploy:
      resources:
        limits:
          cpus: '2'      # Aumentar de 1 a 2 CPUs
          memory: 4G     # Aumentar de 2G a 4G
        reservations:
          cpus: '1'
          memory: 2G
```

### Ver uso de recursos

```bash
# Ver estadísticas de contenedores
docker stats n8n-enhanced postgres

# Ver espacio en disco usado
docker system df -v
```

---

## 🔄 Actualización

### Actualizar a nueva versión

```bash
# Hacer backup primero
docker-compose exec postgres pg_dump -U n8n n8n > backup_$(date +%Y%m%d).sql

# Detener servicios
docker-compose down

# Actualizar código
git pull origin main

# Reconstruir imagen
docker-compose build --no-cache

# Iniciar nuevamente
docker-compose up -d

# Verificar logs
docker-compose logs -f n8n-enhanced
```

---

## 📞 Soporte

Para problemas o preguntas:

1. Revisa la documentación completa en `README-ENHANCED.md`
2. Abre un issue en GitHub
3. Consulta la [documentación oficial de n8n](https://docs.n8n.io)

---

## ⚠️ Disclaimer

Este proyecto es una modificación no oficial de n8n Community Edition para propósitos educativos. Para uso en producción, considera adquirir una licencia oficial de n8n Enterprise.

**n8n Enhanced Edition** - Todas las características Enterprise, sin restricciones. 🚀
