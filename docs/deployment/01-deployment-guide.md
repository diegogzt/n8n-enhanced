# Guía de Despliegue - n8n Enhanced

## 📋 Información General

Esta guía documenta el despliegue completo de n8n Enhanced con todas las características enterprise desbloqueadas.

### 🎯 Objetivo

Desplegar n8n v1.119.0 con características enterprise en servidor Ubuntu 24.04.3 LTS, accesible mediante el dominio n8n.dixai.net

### 🖥️ Información del Servidor

- **IP**: 5.75.249.177
- **SO**: Ubuntu 24.04.3 LTS
- **Disco**: 40GB (6.3GB libres después del despliegue)
- **RAM**: Suficiente para n8n (~330MB en uso)
- **Dominio**: n8n.dixai.net
- **Puerto**: 5678 (backend), 80 (nginx proxy)

---

## 🔧 Arquitectura de Despliegue

### Componentes

1. **Backend (n8n)**: Node.js ejecutando en localhost:5678
2. **Reverse Proxy**: Nginx escuchando en puerto 80
3. **Base de Datos**: SQLite con encriptación
4. **Gestión de Procesos**: systemd service

### Flujo de Tráfico

```
Internet → nginx:80 → localhost:5678 (n8n)
```

---

## 🚀 Proceso de Despliegue

### 1. Preparación del Entorno Local

```bash
# Clonar repositorio
cd /Users/dgtovar/auto
git clone https://github.com/diegogzt/n8n-enhanced.git n8n
cd n8n

# Instalar dependencias
pnpm install

# Compilar proyecto completo
pnpm build
```

### 2. Preparación del Servidor

```bash
# Conectar al servidor
ssh root@5.75.249.177

# Clonar repositorio
cd /opt
git clone https://github.com/diegogzt/n8n-enhanced.git
cd n8n-enhanced

# Instalar dependencias (sin compilar)
pnpm install
```

### 3. Copiar Archivos Compilados

Desde tu Mac local, copia los archivos compilados al servidor:

```bash
# CLI (Backend)
rsync -avz --delete packages/cli/dist/ root@5.75.249.177:/opt/n8n-enhanced/packages/cli/dist/

# Backend Common
rsync -avz --delete packages/@n8n/backend-common/dist/ root@5.75.249.177:/opt/n8n-enhanced/packages/@n8n/backend-common/dist/

# Frontend (Editor UI)
rsync -avz --delete packages/frontend/editor-ui/dist/ root@5.75.249.177:/opt/n8n-enhanced/packages/frontend/editor-ui/dist/
```

### 4. Instalar y Configurar Nginx

```bash
ssh root@5.75.249.177

# Instalar nginx
apt update && apt install -y nginx

# Crear configuración
cat > /etc/nginx/sites-available/n8n << 'EOF'
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80;
    server_name n8n.dixai.net 5.75.249.177;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/n8n
rm -f /etc/nginx/sites-enabled/default

# Verificar y recargar
nginx -t
systemctl reload nginx
```

### 5. Crear Servicio Systemd

```bash
cat > /etc/systemd/system/n8n.service << 'EOF'
[Unit]
Description=n8n Enhanced - Workflow Automation
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/n8n-enhanced
Environment="N8N_SECURE_COOKIE=false"
Environment="N8N_HOST=0.0.0.0"
Environment="N8N_PORT=5678"
Environment="WEBHOOK_URL=http://n8n.dixai.net"
Environment="N8N_EDITOR_BASE_URL=http://n8n.dixai.net"
Environment="DB_TYPE=sqlite"
Environment="DB_SQLITE_DATABASE=/opt/n8n-enhanced/database.sqlite"
Environment="N8N_ENCRYPTION_KEY=w6vEX4NeKVvS7nb8lg505lM8g8XZzhamtrVHdbfll64="
Environment="NODE_ENV=production"
ExecStart=/usr/local/bin/pnpm start
Restart=always
RestartSec=10
StandardOutput=append:/var/log/n8n.log
StandardError=append:/var/log/n8n.log

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd
systemctl daemon-reload

# Habilitar inicio automático
systemctl enable n8n

# Iniciar servicio
systemctl start n8n
```

### 6. Configurar DNS

En tu proveedor de DNS (Vercel para dixai.net):

1. Agregar registro tipo **A**
   - Name: `n8n`
   - Value: `5.75.249.177`
   - TTL: Automático

2. Esperar propagación (5-30 minutos)

3. Verificar:
   ```bash
   nslookup n8n.dixai.net
   ```

---

## 🔨 Modificaciones del Código

### Archivos Modificados para Enterprise

#### 1. `packages/cli/src/license/license-state.ts`

Todas las funciones de features retornan `true`:

```typescript
isLdapEnabled() { return true; }
isSamlEnabled() { return true; }
isAdvancedPermissionsLicensed() { return true; }
isVariablesEnabled() { return true; }
// ... etc
```

#### 2. `packages/cli/src/license/license.ts`

Enterprise features desbloqueadas

#### 3. `packages/frontend/editor-ui/src/init.ts`

Fix para SSO store initialization (líneas 66-82):

```typescript
// Añadido safety check
if (settingsStore.settings?.sso) {
    await useSSOStore().initialize();
}
```

#### 4. `packages/frontend/editor-ui/src/polyfills.ts`

Polyfill para crypto.randomUUID (soporte HTTP):

```typescript
if (!crypto.randomUUID) {
    crypto.randomUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
}
```

#### 5. `packages/frontend/editor-ui/src/main.ts`

Primera línea para cargar polyfills:

```typescript
import './polyfills';
```

#### 6. `packages/frontend/@n8n/rest-api-client/src/utils.ts`

Fallback para crypto.randomUUID (línea 13-15):

```typescript
browserId = crypto.randomUUID?.() ?? 
    self.crypto?.randomUUID?.() ?? 
    `${Date.now()}-${Math.random().toString(36)}`;
```

---

## 🔑 Variables de Entorno Importantes

```bash
# Base de datos
DB_TYPE=sqlite
DB_SQLITE_DATABASE=/opt/n8n-enhanced/database.sqlite
N8N_ENCRYPTION_KEY=w6vEX4NeKVvS7nb8lg505lM8g8XZzhamtrVHdbfll64=

# Red
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_SECURE_COOKIE=false  # true cuando uses HTTPS

# URLs
WEBHOOK_URL=http://n8n.dixai.net
N8N_EDITOR_BASE_URL=http://n8n.dixai.net

# Entorno
NODE_ENV=production
```

---

## 📊 Verificación del Despliegue

### Verificar Backend

```bash
curl http://localhost:5678/rest/settings | jq -r '.version'
# Debería retornar: 1.119.0
```

### Verificar Nginx

```bash
curl http://5.75.249.177 -I
# Debería retornar: HTTP/1.1 200 OK
```

### Verificar Proceso

```bash
ps aux | grep "[n]ode.*n8n"
```

### Verificar Logs

```bash
tail -f /var/log/n8n.log
```

---

## 🐛 Solución de Problemas

### Error: "Could not connect to server"

**Causa**: n8n no está escuchando en 0.0.0.0

**Solución**:
```bash
# Verificar que N8N_HOST=0.0.0.0 esté configurado
systemctl restart n8n
netstat -tlnp | grep 5678
```

### Error: "Secure cookie" en HTTP

**Causa**: N8N_SECURE_COOKIE=true pero estás usando HTTP

**Solución**:
```bash
# Asegurar que N8N_SECURE_COOKIE=false en el servicio
systemctl restart n8n
```

### Frontend con errores crypto.randomUUID

**Causa**: Polyfills no cargados correctamente

**Solución**: Recompilar frontend localmente y copiar al servidor

```bash
# En local Mac
cd /Users/dgtovar/auto/n8n
pnpm build --filter @n8n/rest-api-client --filter n8n-editor-ui

# Copiar al servidor
rsync -avz --delete packages/frontend/editor-ui/dist/ root@5.75.249.177:/opt/n8n-enhanced/packages/frontend/editor-ui/dist/
```

---

## 🔄 Actualización del Sistema

### Actualizar Frontend

```bash
# En local Mac
cd /Users/dgtovar/auto/n8n
git pull
pnpm install
pnpm build --filter n8n-editor-ui

# Copiar al servidor
rsync -avz --delete packages/frontend/editor-ui/dist/ root@5.75.249.177:/opt/n8n-enhanced/packages/frontend/editor-ui/dist/

# Reiniciar en servidor
ssh root@5.75.249.177 'systemctl restart n8n'
```

### Actualizar Backend

```bash
# En local Mac
cd /Users/dgtovar/auto/n8n
pnpm build --filter n8n

# Copiar al servidor
rsync -avz --delete packages/cli/dist/ root@5.75.249.177:/opt/n8n-enhanced/packages/cli/dist/

# Reiniciar
ssh root@5.75.249.177 'systemctl restart n8n'
```

---

## 📝 Notas Importantes

1. **NO compilar en el servidor**: El servidor tiene 40GB de disco y no suficiente para un build completo
2. **Compilar localmente**: Siempre compilar en el Mac local y copiar archivos compilados
3. **Backup de DB**: La base de datos SQLite está en `/opt/n8n-enhanced/database.sqlite` - hacer backups regulares
4. **Encryption Key**: Guardar la clave de encriptación en lugar seguro - sin ella no se puede acceder a la DB

---

**Última actualización**: 9 de noviembre de 2025
