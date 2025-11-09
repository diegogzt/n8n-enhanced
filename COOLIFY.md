# 🚀 Guía de Despliegue en Coolify

Esta guía te ayudará a desplegar n8n Enhanced Edition en Coolify con tu dominio personalizado.

## 📋 Requisitos Previos

- ✅ Cuenta en Coolify
- ✅ Dominio configurado (ej: `n8n.dgtovar.dev`)
- ✅ DNS apuntando a tu servidor Coolify

---

## 🔧 Opción 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Crear Nuevo Servicio en Coolify

1. En Coolify, ve a **Projects** → Selecciona tu proyecto
2. Click en **"+ Add"** → **"New Resource"**
3. Selecciona **"Docker Compose"**
4. Elige **"Public Repository"**
5. URL del repositorio: `https://github.com/diegogzt/n8n-enhanced.git`
6. Branch: `main`

### Paso 2: Configurar Variables de Entorno

En la sección **Environment Variables**, agrega:

```bash
# Domain Configuration (OBLIGATORIO)
N8N_HOST=n8n.dgtovar.dev
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.dgtovar.dev/

# Database (Genera una contraseña segura)
POSTGRES_USER=n8n
POSTGRES_PASSWORD=TU_PASSWORD_SEGURO_AQUI
POSTGRES_DB=n8n

# Encryption Key (Genera uno único)
# Ejecuta: openssl rand -base64 32
N8N_ENCRYPTION_KEY=TU_ENCRYPTION_KEY_AQUI

# Timezone
GENERIC_TIMEZONE=America/New_York
TZ=America/New_York

# Security
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
N8N_RUNNERS_ENABLED=true
```

### Paso 3: Configurar el Dominio

1. En la configuración del servicio, ve a **"Domains"**
2. Agrega: `n8n.dgtovar.dev`
3. Coolify automáticamente:
   - Configurará el proxy reverso (Traefik)
   - Generará el certificado SSL con Let's Encrypt
   - Redirigirá HTTP a HTTPS

### Paso 4: Deploy

1. Click en **"Deploy"**
2. Espera a que la build termine (~5-10 minutos)
3. Verifica los logs para confirmar que n8n está corriendo

---

## 🔧 Opción 2: Despliegue Manual (Docker Compose)

### Paso 1: Crear Nuevo Servicio

1. En Coolify, crea un nuevo servicio **Docker Compose**
2. Selecciona **"Simple Docker Compose"**

### Paso 2: Pegar el docker-compose.yml

Copia y pega el contenido del archivo `docker-compose.yml` de este repositorio.

### Paso 3: Configurar Variables

Coolify detectará automáticamente las variables en el compose. Configúralas:

- `N8N_HOST`: `n8n.dgtovar.dev`
- `N8N_PROTOCOL`: `https`
- `WEBHOOK_URL`: `https://n8n.dgtovar.dev/`
- `POSTGRES_PASSWORD`: Una contraseña segura
- `N8N_ENCRYPTION_KEY`: Genera con `openssl rand -base64 32`

### Paso 4: Configurar Dominio y Deploy

Igual que en la Opción 1, pasos 3 y 4.

---

## ✅ Verificación

### Verificar que n8n está corriendo

1. Ve a **Logs** en Coolify
2. Deberías ver: `n8n ready on ::, port 5678`
3. Accede a: `https://n8n.dgtovar.dev`

### Verificar SSL

1. Abre `https://n8n.dgtovar.dev`
2. Verifica el candado en el navegador
3. El certificado debe ser válido (Let's Encrypt)

---

## 🔐 Configuración de DNS

Asegúrate de que tu DNS esté configurado correctamente:

### Registro A
```
Tipo: A
Nombre: n8n
Valor: IP_DE_TU_SERVIDOR_COOLIFY
TTL: 3600
```

O si usas subdominios:

### Registro CNAME
```
Tipo: CNAME
Nombre: n8n.dgtovar.dev
Valor: tu-servidor.coolify.com
TTL: 3600
```

---

## 🎯 Post-Instalación

### 1. Primer Acceso

1. Abre `https://n8n.dgtovar.dev`
2. Crea tu cuenta de administrador
3. ¡Disfruta de todas las features Enterprise!

### 2. Verificar Features Desbloqueadas

Ve a **Settings** y verifica que aparecen:
- ✅ Projects
- ✅ Variables
- ✅ External Secrets
- ✅ SSO/OIDC
- ✅ LDAP
- ✅ Log Streaming

### 3. Configurar Webhooks

Todos los webhooks usarán automáticamente: `https://n8n.dgtovar.dev/webhook/...`

---

## 🔧 Troubleshooting

### El servicio no inicia

```bash
# Ver logs en Coolify
# Click en "Logs" en tu servicio

# Buscar errores relacionados con:
# - Database connection
# - Port conflicts
# - Environment variables
```

### Error de conexión a base de datos

1. Verifica que el servicio `postgres` esté "healthy"
2. Revisa las variables de entorno de la base de datos
3. Asegúrate de que `DB_POSTGRESDB_HOST=postgres` (nombre del servicio)

### Dominio no resuelve

1. Verifica tu configuración DNS
2. Espera propagación DNS (hasta 24h, normalmente minutos)
3. Verifica que Coolify tenga el dominio configurado correctamente
4. Revisa los logs de Traefik en Coolify

### SSL no funciona

1. Coolify genera automáticamente certificados Let's Encrypt
2. Verifica que el puerto 80 y 443 estén abiertos
3. Asegúrate de que el dominio resuelve correctamente
4. Revisa logs de Traefik para errores de certificado

---

## 📊 Comandos Útiles en Coolify

### Ver Logs
- Click en tu servicio → **Logs**
- Filtrar por servicio: `n8n-enhanced` o `postgres`

### Reiniciar Servicio
- Click en **Restart**

### Rebuild
- Click en **Rebuild** (útil después de cambios en código)

### Actualizar Variables
- **Settings** → **Environment Variables** → Modifica → **Save** → **Restart**

---

## 🔄 Actualización

### Actualizar a Nueva Versión

1. En Coolify, ve a tu servicio
2. Click en **"Redeploy"**
3. Coolify hará pull del repo y rebuild automático

O manualmente:
```bash
# Hacer cambios en el repo
git pull origin main

# En Coolify, click en "Deploy"
```

---

## 🎉 ¡Listo!

Tu n8n Enhanced está ahora corriendo en:
- 🌐 `https://n8n.dgtovar.dev`
- 🔒 SSL automático con Let's Encrypt
- 🚀 Todas las features Enterprise desbloqueadas
- 💾 Base de datos PostgreSQL persistente
- 🔄 Auto-restart en caso de fallos

---

## 📞 Soporte

- 📖 [Documentación completa](../INSTALL.md)
- 🐛 [Reportar problemas](https://github.com/diegogzt/n8n-enhanced/issues)
- 💬 [Documentación de Coolify](https://coolify.io/docs)

---

**¡Disfruta de n8n Enhanced con todas las características Enterprise!** 🎊
