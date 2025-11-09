# n8n Enhanced - Documentación

## 📚 Índice de Documentación

Esta carpeta contiene toda la documentación del proyecto n8n Enhanced con características enterprise desbloqueadas.

### 📁 Estructura de Documentación

- **[deployment/](./deployment/)** - Guías de despliegue y configuración
  - [01-deployment-guide.md](./deployment/01-deployment-guide.md) - Guía completa de despliegue
  - [02-https-setup.md](./deployment/02-https-setup.md) - Configuración de HTTPS con Let's Encrypt
  
- **[server-management/](./server-management/)** - Gestión del servidor
  - [server-commands.md](./server-management/server-commands.md) - Comandos útiles del servidor

### 🚀 Inicio Rápido

1. **Desarrollo Local**: El proyecto está listo para desarrollo en `/Users/dgtovar/auto/n8n`
2. **Servidor de Producción**: Desplegado en `5.75.249.177` (http://n8n.dixai.net)
3. **Características**: Todas las features enterprise desbloqueadas

### 📖 Documentos Principales

- [Guía de Despliegue Completa](./deployment/01-deployment-guide.md)
- [Configuración de HTTPS](./deployment/02-https-setup.md)
- [Comandos del Servidor](./server-management/server-commands.md)

### 🔑 Características Enterprise Desbloqueadas

- ✅ LDAP Authentication
- ✅ SAML SSO
- ✅ Advanced Permissions
- ✅ Variables
- ✅ External Secrets
- ✅ Log Streaming
- ✅ Worker View
- ✅ Advanced Execution Filters
- ✅ API Disabled

### 🛠️ Información Técnica

- **Versión**: n8n v1.119.0
- **Node.js**: v22.19.0
- **Package Manager**: pnpm 10.18.3
- **Base de Datos**: SQLite con encriptación
- **Servidor Web**: Nginx como reverse proxy

### 📝 Notas Importantes

- El código **NO debe ser modificado** sin documentar los cambios
- Todos los cambios en archivos críticos están documentados en la guía de despliegue
- La base de datos usa encriptación con clave específica (ver deployment guide)

### 🔗 Enlaces Útiles

- Repositorio: https://github.com/diegogzt/n8n-enhanced
- Servidor Producción: http://n8n.dixai.net
- IP del Servidor: 5.75.249.177

---

**Última actualización**: 9 de noviembre de 2025
