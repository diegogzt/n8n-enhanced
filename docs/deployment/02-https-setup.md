# Configuración de HTTPS con Let's Encrypt

## 🔒 Objetivo

Configurar HTTPS con certificado SSL gratuito de Let's Encrypt para el dominio n8n.dixai.net

---

## ⚠️ Requisitos Previos

Antes de comenzar, asegúrate de que:

1. ✅ El DNS está propagado correctamente
2. ✅ n8n está funcionando en HTTP (http://n8n.dixai.net)
3. ✅ El puerto 80 está abierto y respondiendo
4. ✅ El dominio apunta a la IP correcta (5.75.249.177)

### Verificar DNS

```bash
# Desde tu Mac
nslookup n8n.dixai.net

# Debería mostrar:
# Name: n8n.dixai.net
# Address: 5.75.249.177
```

### Verificar HTTP

```bash
curl -I http://n8n.dixai.net

# Debería retornar: HTTP/1.1 200 OK
```

---

## 📦 Paso 1: Instalar Certbot

```bash
ssh root@5.75.249.177

# Actualizar sistema
apt update

# Instalar Certbot con plugin de Nginx
apt install -y certbot python3-certbot-nginx
```

---

## 🔐 Paso 2: Obtener Certificado SSL

```bash
# Ejecutar Certbot
certbot --nginx -d n8n.dixai.net

# Responder a las preguntas:
# 1. Email: tu-email@ejemplo.com (para notificaciones de renovación)
# 2. Términos de servicio: Yes (A)
# 3. Compartir email con EFF: No (N) o Yes (Y) - tu preferencia
# 4. Redirect HTTP to HTTPS: Yes (2) - RECOMENDADO
```

### ¿Qué hace Certbot?

1. Valida que controlas el dominio
2. Obtiene el certificado SSL de Let's Encrypt
3. Configura Nginx automáticamente para usar HTTPS
4. Configura renovación automática del certificado

---

## 🔧 Paso 3: Actualizar Configuración de n8n

Después de instalar el certificado, debes actualizar n8n para usar cookies seguras:

```bash
# Editar el servicio systemd
nano /etc/systemd/system/n8n.service
```

### Cambiar esta línea:

```ini
Environment="N8N_SECURE_COOKIE=false"
```

### Por esta:

```ini
Environment="N8N_SECURE_COOKIE=true"
```

### Actualizar también las URLs a HTTPS:

```ini
Environment="WEBHOOK_URL=https://n8n.dixai.net"
Environment="N8N_EDITOR_BASE_URL=https://n8n.dixai.net"
```

### Archivo completo actualizado:

```ini
[Unit]
Description=n8n Enhanced - Workflow Automation
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/n8n-enhanced
Environment="N8N_SECURE_COOKIE=true"
Environment="N8N_HOST=0.0.0.0"
Environment="N8N_PORT=5678"
Environment="WEBHOOK_URL=https://n8n.dixai.net"
Environment="N8N_EDITOR_BASE_URL=https://n8n.dixai.net"
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
```

### Guardar y reiniciar:

```bash
# Guardar: Ctrl+O, Enter
# Salir: Ctrl+X

# Recargar systemd y reiniciar n8n
systemctl daemon-reload
systemctl restart n8n
```

---

## 🔄 Paso 4: Actualizar Alias de Comandos

También actualiza el alias `n8n-start` para usar HTTPS:

```bash
# Editar bashrc
nano /root/.bashrc
```

Busca la línea que comienza con `alias n8n-start=` y actualiza:

```bash
alias n8n-start="cd /opt/n8n-enhanced && N8N_SECURE_COOKIE=true N8N_HOST=0.0.0.0 N8N_PORT=5678 WEBHOOK_URL=https://n8n.dixai.net N8N_EDITOR_BASE_URL=https://n8n.dixai.net DB_TYPE=sqlite DB_SQLITE_DATABASE=/opt/n8n-enhanced/database.sqlite N8N_ENCRYPTION_KEY=w6vEX4NeKVvS7nb8lg505lM8g8XZzhamtrVHdbfll64= NODE_ENV=production pnpm start > /var/log/n8n.log 2>&1 & echo \"✅ n8n iniciado. PID: \$!\" && echo \$! > /tmp/n8n.pid"
```

```bash
# Recargar bashrc
source /root/.bashrc
```

---

## ✅ Paso 5: Verificar HTTPS

### Verificar certificado:

```bash
# Ver información del certificado
certbot certificates

# Debería mostrar:
# - Certificate Name: n8n.dixai.net
# - Domains: n8n.dixai.net
# - Expiry Date: (90 días desde hoy)
# - Valid: Yes
```

### Probar en navegador:

1. Abre https://n8n.dixai.net
2. Verifica el candado verde en la barra de direcciones
3. Click en el candado → Debería mostrar "Conexión segura"

### Verificar redirección HTTP → HTTPS:

```bash
curl -I http://n8n.dixai.net

# Debería retornar:
# HTTP/1.1 301 Moved Permanently
# Location: https://n8n.dixai.net/
```

---

## 🔄 Renovación Automática del Certificado

Certbot configura automáticamente la renovación del certificado. Los certificados de Let's Encrypt duran 90 días y se renuevan automáticamente.

### Verificar configuración de renovación automática:

```bash
# Ver timer de systemd
systemctl status certbot.timer

# Debería mostrar: Active: active (waiting)
```

### Probar renovación manualmente (dry-run):

```bash
certbot renew --dry-run

# Si todo está bien, verás:
# Congratulations, all simulated renewals succeeded
```

### Forzar renovación manual (solo si es necesario):

```bash
certbot renew --force-renewal
systemctl reload nginx
```

---

## 🔍 Verificar Configuración de Nginx

Certbot modifica automáticamente la configuración de Nginx. Puedes verificarla:

```bash
cat /etc/nginx/sites-available/n8n
```

Deberías ver algo como:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
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

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/n8n.dixai.net/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/n8n.dixai.net/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = n8n.dixai.net) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name n8n.dixai.net 5.75.249.177;
    return 404; # managed by Certbot
}
```

---

## 🐛 Solución de Problemas

### Error: "Too Many Requests"

**Causa**: Intentaste obtener el certificado demasiadas veces en poco tiempo.

**Solución**: 
- Let's Encrypt tiene límites de intentos (5 por semana para el mismo dominio)
- Espera 1 semana o usa `--dry-run` para probar primero
- Usa staging para pruebas: `certbot --nginx --staging -d n8n.dixai.net`

### Error: "Connection refused" en puerto 80

**Causa**: Nginx no está escuchando en puerto 80 o firewall bloqueando.

**Solución**:
```bash
# Verificar que nginx está corriendo
systemctl status nginx

# Verificar puerto
netstat -tlnp | grep :80

# Verificar firewall (si está activo)
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
```

### Error: "DNS problema"

**Causa**: El dominio no resuelve a la IP correcta.

**Solución**:
```bash
# Verificar DNS
nslookup n8n.dixai.net

# Esperar más tiempo para propagación (hasta 24-48 horas en algunos casos)
# O contactar con tu proveedor de DNS
```

### El navegador muestra "No seguro" después de instalar certificado

**Causa**: El navegador tiene caché o estás usando HTTP.

**Solución**:
```bash
# Limpiar caché del navegador
# Abrir en modo incógnito
# Verificar que estás usando https:// (no http://)
# Verificar certificado con: openssl s_client -connect n8n.dixai.net:443
```

---

## 🔐 Seguridad Adicional (Opcional)

### Configurar HSTS (HTTP Strict Transport Security)

```bash
# Editar configuración de nginx
nano /etc/nginx/sites-available/n8n

# Agregar dentro del bloque server (HTTPS):
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Recargar nginx
nginx -t
systemctl reload nginx
```

### Verificar calificación SSL

Prueba tu configuración SSL en: https://www.ssllabs.com/ssltest/

Ingresa `n8n.dixai.net` y espera el análisis. Debería obtener una calificación A o A+.

---

## 📊 Monitoreo del Certificado

### Verificar fecha de expiración:

```bash
echo | openssl s_client -servername n8n.dixai.net -connect n8n.dixai.net:443 2>/dev/null | openssl x509 -noout -dates
```

### Configurar alerta de expiración:

Certbot envía emails automáticamente a la dirección configurada cuando el certificado está por vencer (30 días antes).

---

## 📝 Checklist Final

- [ ] Certificado SSL instalado correctamente
- [ ] HTTPS funcionando (https://n8n.dixai.net)
- [ ] Redirección HTTP → HTTPS activa
- [ ] N8N_SECURE_COOKIE=true configurado
- [ ] URLs actualizadas a HTTPS en el servicio
- [ ] Renovación automática configurada
- [ ] Calificación SSL A o A+ en SSLLabs
- [ ] Webhooks funcionando con HTTPS

---

## 🎉 ¡Listo!

Ahora tu instalación de n8n Enhanced está completamente segura con HTTPS. Los usuarios accederán mediante:

**https://n8n.dixai.net**

El certificado se renovará automáticamente cada 90 días sin intervención manual.

---

**Última actualización**: 9 de noviembre de 2025
