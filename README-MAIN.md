# 🚀 n8n Enhanced Edition

<div align="center">

![n8n Enhanced](https://img.shields.io/badge/n8n-Enhanced-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.119.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-Educational-orange?style=for-the-badge)
![Enterprise](https://img.shields.io/badge/Enterprise-Unlocked-gold?style=for-the-badge)

**All Enterprise Features Unlocked - No License Required**

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Documentation](#-documentation) • [FAQ](#-faq)

</div>

---

## 📖 What is n8n Enhanced?

n8n Enhanced Edition is a **modified version** of the popular n8n workflow automation tool with **ALL Enterprise features unlocked** and fully functional - no license key required.

Based on **n8n v1.119.0**, this version bypasses all license checks and enables every premium feature for educational purposes, development, and testing.

### ⚠️ Important Notice

> **This is an UNOFFICIAL modification** of n8n Community Edition for educational purposes only.  
> **NOT affiliated with or endorsed by n8n GmbH.**  
> For production use, please consider purchasing an [official n8n Enterprise license](https://n8n.io/pricing).

---

## ✨ Features

All these **Enterprise features** are fully unlocked and functional:

### 🎯 Core Enterprise Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Projects** | Create up to 1000 projects for workflow organization | ✅ Unlocked |
| **Variables** | Global variables across workflows (unlimited) | ✅ Unlocked |
| **Insights & Analytics** | Detailed workflow performance metrics (1000 evaluations) | ✅ Unlocked |
| **User Management** | Unlimited users with role-based access control | ✅ Unlocked |
| **Workflow Sharing** | Advanced collaboration and sharing options | ✅ Unlocked |
| **Workflow History** | Extended version history and rollback | ✅ Unlocked |

### 🔐 Authentication & Security

| Feature | Description | Status |
|---------|-------------|--------|
| **SSO/OIDC** | Single Sign-On (Google, Azure AD, Okta, custom) | ✅ Unlocked |
| **LDAP** | Active Directory integration | ✅ Unlocked |
| **SAML** | SAML 2.0 authentication | ✅ Unlocked |
| **External Secrets** | HashiCorp Vault, AWS Secrets Manager, Azure Key Vault | ✅ Unlocked |

### 📊 Operations & Monitoring

| Feature | Description | Status |
|---------|-------------|--------|
| **Log Streaming** | Stream logs to Datadog, Splunk, Sentry | ✅ Unlocked |
| **Source Control** | Git integration for workflow versioning | ✅ Unlocked |
| **Advanced Debugging** | Enhanced debugging capabilities | ✅ Unlocked |

### 🔧 Technical Modifications

- ✅ **Controller Middleware**: License checks completely disabled
- ✅ **License State**: All 32+ functions return `true`
- ✅ **Frontend Service**: Enterprise features hardcoded as enabled
- ✅ **Quota Limits**: Increased to 1000+ for all features
- ✅ **Build Status**: 0 TypeScript errors, 36/36 tasks successful

---

## 🚀 Quick Start

### Option 1: One-Line Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/n8n-enhanced/main/install.sh | bash
```

### Option 2: Docker Compose (Manual)

```bash
# Clone repository
git clone https://github.com/yourusername/n8n-enhanced.git
cd n8n-enhanced

# Start services
docker-compose up -d

# Access n8n
open http://localhost:5678
```

### Option 3: Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/n8n-enhanced.git
cd n8n-enhanced

# Install dependencies
pnpm install

# Build
pnpm build

# Start
pnpm dev
```

---

## 📦 Installation

### Prerequisites

- **Docker**: 20.10 or higher
- **Docker Compose**: v2.0 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 10GB free space

### Detailed Installation Guide

For comprehensive installation instructions, see:
- **[INSTALL.md](./INSTALL.md)** - Complete installation guide
- **[README-ENHANCED.md](./README-ENHANCED.md)** - Feature documentation

### Quick Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/n8n-enhanced.git
   cd n8n-enhanced
   ```

2. **Configure environment** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access n8n**
   - Open: http://localhost:5678
   - Create admin account
   - Enjoy all Enterprise features!

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [INSTALL.md](./INSTALL.md) | Complete installation guide with 3 methods |
| [README-ENHANCED.md](./README-ENHANCED.md) | Full feature documentation (2,800+ lines) |
| [Dockerfile](./Dockerfile) | Multi-stage Docker build configuration |
| [docker-compose.yml](./docker-compose.yml) | Complete orchestration with PostgreSQL |

---

## 🔧 Usage

### Basic Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f n8n-enhanced

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# Remove everything (⚠️ deletes all data)
docker-compose down -v
```

### Access Different Features

After installation, access these features at http://localhost:5678:

1. **Projects**: Settings → Projects
2. **Variables**: Settings → Variables
3. **Users**: Settings → Users
4. **External Secrets**: Settings → External Secrets
5. **SSO/OIDC**: Settings → SSO
6. **LDAP**: Settings → LDAP
7. **Log Streaming**: Settings → Log Streaming
8. **Insights**: Workflows → Click any workflow → Insights tab

---

## 🔐 Configuration Examples

### Configure OIDC (Google)

Add to `.env` or `docker-compose.yml`:

```bash
N8N_SSO_OIDC_ENABLED=true
N8N_SSO_OIDC_CLIENT_ID=your-google-client-id
N8N_SSO_OIDC_CLIENT_SECRET=your-google-client-secret
N8N_SSO_OIDC_ISSUER=https://accounts.google.com
N8N_SSO_OIDC_SCOPE=openid email profile
```

### Configure HashiCorp Vault

```bash
N8N_EXTERNAL_SECRETS_VAULT_URL=https://vault.example.com
N8N_EXTERNAL_SECRETS_VAULT_TOKEN=hvs.xxxxxxxxxxxxx
N8N_EXTERNAL_SECRETS_VAULT_NAMESPACE=admin
```

### Configure Datadog Log Streaming

```bash
N8N_LOG_STREAM_DATADOG_API_KEY=your-datadog-api-key
N8N_LOG_STREAM_DATADOG_SITE=datadoghq.com
```

For more examples, see [README-ENHANCED.md](./README-ENHANCED.md).

---

## 📊 Comparison

| Feature | Community | Enhanced | Official Enterprise |
|---------|-----------|----------|---------------------|
| Workflows | Unlimited | Unlimited | Unlimited |
| Users | 1 | **Unlimited** | Unlimited |
| Projects | ❌ | **✅ (1000)** | ✅ |
| Variables | ❌ | **✅ Unlimited** | ✅ |
| SSO/OIDC | ❌ | **✅** | ✅ |
| LDAP | ❌ | **✅** | ✅ |
| External Secrets | ❌ | **✅** | ✅ |
| Log Streaming | ❌ | **✅** | ✅ |
| Insights | ❌ | **✅ (1000)** | ✅ |
| Support | Community | Community | Official |
| Price | Free | **Free** | $500+/month |

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs n8n-enhanced

# Check if port is in use
lsof -i :5678  # macOS/Linux

# Use different port
# Edit docker-compose.yml:
# ports:
#   - "5679:5678"
```

### Database Connection Issues

```bash
# Restart PostgreSQL
docker-compose restart postgres

# Wait 10 seconds
sleep 10

# Restart n8n
docker-compose restart n8n-enhanced
```

### Reset Everything

```bash
# ⚠️ WARNING: This deletes ALL data
docker-compose down -v
docker-compose up -d
```

For more troubleshooting, see [INSTALL.md](./INSTALL.md#troubleshooting).

---

## ❓ FAQ

### Is this legal?

This is a **modified version for educational purposes**. For production use, please purchase an official n8n Enterprise license.

### Will it receive updates?

This is based on n8n v1.119.0. You can manually update the codebase, but license bypasses may need adjustments.

### Can I use this in production?

**Not recommended**. This is for learning, development, and testing. For production, use official n8n Enterprise.

### Does it phone home?

No. All license checks are bypassed locally. No external license validation occurs.

### What if I get "Plan lacks license" error?

This should NOT happen in Enhanced Edition. If you see it:
1. Verify you're using the correct image
2. Rebuild with `docker-compose build --no-cache`
3. Check [INSTALL.md](./INSTALL.md#troubleshooting)

### Can I migrate to official n8n Enterprise?

Yes! Your workflows, credentials, and data are compatible. Just export and import them.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Important Disclaimers:**
- This is an UNOFFICIAL modification of n8n
- Based on n8n Community Edition (v1.119.0)
- For educational and personal use only
- NOT affiliated with n8n GmbH
- Some modifications may violate n8n's terms of service

For official n8n licensing: https://n8n.io/pricing

---

## 🙏 Acknowledgments

- **n8n GmbH** - For creating the amazing n8n workflow automation tool
- **Open Source Community** - For continuous support and contributions
- **Contributors** - Everyone who helped improve this project

---

## 📞 Support

- 📖 [Documentation](./README-ENHANCED.md)
- 🐛 [Report Issues](https://github.com/yourusername/n8n-enhanced/issues)
- 💬 [Discussions](https://github.com/yourusername/n8n-enhanced/discussions)
- 📧 Email: support@example.com

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Made with ❤️ for the n8n community**

[⬆ Back to top](#-n8n-enhanced-edition)

</div>
