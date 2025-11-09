# Comandos del Servidor - n8n Enhanced

## 🎯 Comandos Disponibles

Esta guía documenta todos los comandos disponibles en el servidor para gestionar n8n Enhanced.

---

## 📋 Comandos Básicos

### Iniciar n8n

```bash
n8n-start
```

Inicia n8n manualmente en segundo plano. Retorna el PID del proceso.

**Salida esperada**:
```
✅ n8n iniciado. PID: 123456
```

---

### Detener n8n

```bash
n8n-stop
```

Detiene todos los procesos de n8n.

**Salida esperada**:
```
✅ n8n detenido
```

---

### Reiniciar n8n

```bash
n8n-restart
```

Detiene y vuelve a iniciar n8n. Útil después de cambios de configuración.

**Salida esperada**:
```
✅ n8n detenido
✅ n8n iniciado. PID: 123456
```

---

### Ver Estado de n8n

```bash
n8n-status
```

Muestra información sobre el proceso de n8n y verifica conectividad.

**Salida esperada**:
```
root     123456  3.9  4.1 33634952 329376 ?     Sl   19:33   0:14 node ./n8n
---
1.119.0
✅ n8n está corriendo
```

---

### Información Completa del Sistema

```bash
n8n-info
```

Muestra un resumen completo de la configuración y estado.

**Salida esperada**:
```
🚀 n8n Enhanced - Management Commands

URL: http://n8n.dixai.net
Puerto: 5678
Database: /opt/n8n-enhanced/database.sqlite
Logs: /var/log/n8n.log

[Estado del proceso...]
```

---

## 📊 Comandos de Logs y Diagnóstico

### Ver Logs en Tiempo Real

```bash
n8n-logs
```

Muestra los logs de n8n en tiempo real (tail -f).

**Para salir**: Presiona `Ctrl+C`

---

### Ver Últimas 50 Líneas de Logs

```bash
n8n-logs-tail
```

Muestra las últimas 50 líneas del archivo de log.

---

### Ver Solo Errores Recientes

```bash
n8n-errors
```

Filtra y muestra solo las líneas con errores de los logs (últimas 20).

---

### Verificar Puerto

```bash
n8n-port
```

Verifica que n8n está escuchando en el puerto 5678.

**Salida esperada**:
```
tcp6       0      0 :::5678                 :::*                    LISTEN      123456/node
```

---

### Ver Espacio en Disco

```bash
n8n-disk
```

Muestra el espacio disponible en disco y el tamaño del directorio de n8n.

**Salida esperada**:
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        40G   34G  6.3G  84% /
---
1.2G    /opt/n8n-enhanced
```

---

## 🔧 Comandos Systemd (Producción)

Estos comandos usan systemd para gestionar n8n como un servicio del sistema. **Recomendados para producción**.

### Iniciar Servicio

```bash
n8n-service-start
```

Inicia n8n como servicio systemd.

**Salida esperada**:
```
✅ Servicio n8n iniciado
```

---

### Detener Servicio

```bash
n8n-service-stop
```

Detiene el servicio systemd de n8n.

**Salida esperada**:
```
✅ Servicio n8n detenido
```

---

### Reiniciar Servicio

```bash
n8n-service-restart
```

Reinicia el servicio systemd de n8n.

**Salida esperada**:
```
✅ Servicio n8n reiniciado
```

---

### Ver Estado del Servicio

```bash
n8n-service-status
```

Muestra el estado detallado del servicio systemd.

**Salida esperada**:
```
● n8n.service - n8n Enhanced - Workflow Automation
     Loaded: loaded (/etc/systemd/system/n8n.service; enabled; vendor preset: enabled)
     Active: active (running) since Sat 2025-11-09 19:33:00 UTC; 1h 30min ago
   Main PID: 123456 (node)
      Tasks: 11 (limit: 4915)
     Memory: 329.4M
     CGroup: /system.slice/n8n.service
             └─123456 node ./n8n
```

---

### Habilitar Inicio Automático

```bash
n8n-enable
```

Configura n8n para que se inicie automáticamente al arrancar el servidor.

**Salida esperada**:
```
Created symlink /etc/systemd/system/multi-user.target.wants/n8n.service → /etc/systemd/system/n8n.service.
✅ n8n se iniciará automáticamente al arrancar el servidor
```

---

### Deshabilitar Inicio Automático

```bash
n8n-disable
```

Deshabilita el inicio automático de n8n.

**Salida esperada**:
```
Removed /etc/systemd/system/multi-user.target.wants/n8n.service.
✅ Inicio automático deshabilitado
```

---

## 💡 Ejemplos de Uso

### Escenario 1: Despliegue Inicial

```bash
# Conectar al servidor
ssh root@5.75.249.177

# Habilitar y arrancar servicio
n8n-enable
n8n-service-start

# Verificar que todo está corriendo
n8n-info
```

---

### Escenario 2: Actualización del Frontend

```bash
# Después de copiar archivos compilados desde local
ssh root@5.75.249.177

# Reiniciar n8n
n8n-service-restart

# Verificar logs para confirmar arranque correcto
n8n-logs-tail
```

---

### Escenario 3: Diagnóstico de Problemas

```bash
# Verificar estado
n8n-status

# Si hay problemas, revisar errores
n8n-errors

# Ver logs completos en tiempo real
n8n-logs

# Verificar puerto
n8n-port

# Si es necesario, reiniciar
n8n-restart
```

---

### Escenario 4: Mantenimiento

```bash
# Detener servicio para mantenimiento
n8n-service-stop

# Realizar cambios necesarios...

# Reiniciar servicio
n8n-service-start

# Verificar que arrancó correctamente
n8n-service-status
```

---

## 🔍 Comandos Avanzados (Directos)

### Ver Procesos de n8n

```bash
ps aux | grep "[n]ode.*n8n"
```

### Ver Conexiones de Red

```bash
netstat -tlnp | grep 5678
```

### Ver Logs del Sistema (journalctl)

```bash
journalctl -u n8n -f
```

### Verificar API de n8n

```bash
curl http://localhost:5678/rest/settings | jq -r '.version'
```

### Backup de Base de Datos

```bash
# Detener n8n
n8n-service-stop

# Copiar base de datos
cp /opt/n8n-enhanced/database.sqlite /root/backup/database-$(date +%Y%m%d).sqlite

# Reiniciar n8n
n8n-service-start
```

### Restaurar Base de Datos desde Backup

```bash
# Detener n8n
n8n-service-stop

# Restaurar
cp /root/backup/database-20251109.sqlite /opt/n8n-enhanced/database.sqlite

# Reiniciar
n8n-service-start
```

---

## 📝 Variables de Entorno del Servicio

Para modificar las variables de entorno de n8n, edita el archivo del servicio:

```bash
nano /etc/systemd/system/n8n.service
```

Después de modificar, recarga y reinicia:

```bash
systemctl daemon-reload
n8n-service-restart
```

---

## 🆘 Ayuda Rápida en el Servidor

Para ver esta ayuda en el servidor:

```bash
cat /root/n8n-commands.txt
```

---

## 📍 Ubicaciones Importantes

| Recurso | Ubicación |
|---------|-----------|
| Código fuente | `/opt/n8n-enhanced` |
| Base de datos | `/opt/n8n-enhanced/database.sqlite` |
| Logs | `/var/log/n8n.log` |
| Servicio systemd | `/etc/systemd/system/n8n.service` |
| Configuración nginx | `/etc/nginx/sites-available/n8n` |
| Comandos de ayuda | `/root/n8n-commands.txt` |
| Aliases bash | `/root/.bashrc` |

---

## 🔐 Información de Seguridad

### Encryption Key

La clave de encriptación de la base de datos está configurada en el servicio systemd:

```
N8N_ENCRYPTION_KEY=w6vEX4NeKVvS7nb8lg505lM8g8XZzhamtrVHdbfll64=
```

⚠️ **IMPORTANTE**: Guarda esta clave en un lugar seguro. Sin ella, no podrás acceder a la base de datos.

### Backup de la Clave

```bash
echo "w6vEX4NeKVvS7nb8lg505lM8g8XZzhamtrVHdbfll64=" > /root/.n8n-encryption-key.txt
chmod 600 /root/.n8n-encryption-key.txt
```

---

## 🚀 Mejores Prácticas

1. **Usa systemd en producción**: Los comandos `n8n-service-*` son más robustos
2. **Habilita inicio automático**: Ejecuta `n8n-enable` para que n8n arranque con el servidor
3. **Monitorea los logs**: Revisa regularmente `n8n-logs-tail` o `n8n-errors`
4. **Haz backups regulares**: Programa backups automáticos de la base de datos
5. **Verifica el estado**: Usa `n8n-info` periódicamente para confirmar que todo funciona

---

**Última actualización**: 9 de noviembre de 2025
