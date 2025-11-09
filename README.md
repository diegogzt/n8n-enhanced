![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n Enhanced - Enterprise Features Unlocked

> **Fork of n8n v1.119.0** with all enterprise features permanently enabled

This is a modified version of n8n that unlocks all enterprise features including LDAP, SAML SSO, Advanced Permissions, Variables, External Secrets, and more - **completely free**.

**🔗 Live Demo**: https://n8n.dixai.net

![n8n.io - Screenshot](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-screenshot-readme.png)

## ✨ Unlocked Enterprise Features

- ✅ **LDAP Authentication** - Connect with your enterprise directory
- ✅ **SAML SSO** - Single Sign-On integration
- ✅ **Advanced Permissions** - Granular access control
- ✅ **Variables** - Centralized configuration management
- ✅ **External Secrets** - Secure credential storage
- ✅ **Log Streaming** - Enterprise logging capabilities
- ✅ **Worker View** - Advanced execution monitoring
- ✅ **Advanced Execution Filters** - Enhanced workflow insights
- ✅ **All Enterprise API Features** - Full API access

## 🚀 Production Deployment

This repository is deployed and running at:
- **URL**: https://n8n.dixai.net
- **Version**: n8n v1.119.0 (modified)
- **Server**: Ubuntu 24.04.3 LTS
- **Database**: SQLite with encryption

## 📋 Documentation

Complete deployment and management documentation is available in the [`/docs`](/docs) folder:

- **[Deployment Guide](/docs/deployment/01-deployment-guide.md)** - Complete server setup instructions
- **[HTTPS Setup](/docs/deployment/02-https-setup.md)** - Configure SSL with Let's Encrypt
- **[Server Commands](/docs/server-management/server-commands.md)** - Management commands reference

## 🛠️ Quick Start - Development

Clone and build the project locally:

```bash
# Clone repository
git clone https://github.com/diegogzt/n8n-enhanced.git
cd n8n-enhanced

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start n8n locally
cd packages/cli
pnpm start
```

Access the editor at http://localhost:5678

## 🌐 Production Deployment

See the complete [Deployment Guide](/docs/deployment/01-deployment-guide.md) for production deployment instructions.

**Key points:**
- Build locally, deploy compiled files to server (server has limited resources)
- Use systemd service for process management
- Configure Nginx as reverse proxy
- Enable HTTPS with Let's Encrypt (see [HTTPS Setup Guide](/docs/deployment/02-https-setup.md))

## 🔧 Technical Details

- **Base Version**: n8n v1.119.0
- **Node.js**: v22.19.0
- **Package Manager**: pnpm 10.18.3
- **Modified Files**:
  - `packages/cli/src/license/license-state.ts` - All enterprise features enabled
  - `packages/cli/src/license/license.ts` - License checks bypassed
  - `packages/frontend/editor-ui/src/init.ts` - SSO initialization fixes
  - `packages/frontend/editor-ui/src/polyfills.ts` - crypto.randomUUID polyfill
  - `packages/frontend/@n8n/rest-api-client/src/utils.ts` - Fallback implementations

## 📚 Original n8n Resources

- 📚 [Official Documentation](https://docs.n8n.io)
- 🔧 [400+ Integrations](https://n8n.io/integrations)
- 💡 [Example Workflows](https://n8n.io/workflows)
- 🤖 [AI & LangChain Guide](https://docs.n8n.io/advanced-ai/)
- 👥 [Community Forum](https://community.n8n.io)

## ⚠️ Disclaimer

This is a modified version of n8n for educational and internal use purposes. The original n8n is developed by [n8n.io](https://n8n.io) and distributed under the [Sustainable Use License](https://github.com/n8n-io/n8n/blob/master/LICENSE.md).

**Important Notes:**
- This fork is **not affiliated** with or endorsed by n8n GmbH
- Enterprise features are unlocked for **personal/internal use only**
- For commercial use, consider purchasing an official n8n enterprise license
- Some features may not work as intended without proper enterprise infrastructure

## 📄 License

Based on n8n's [fair-code](https://faircode.io) license:
- [Sustainable Use License](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)
- [n8n Enterprise License](https://github.com/n8n-io/n8n/blob/master/LICENSE_EE.md)

**Modifications**: All modifications to enable enterprise features are provided as-is for educational purposes.

---

## 🙏 Credits

Original n8n workflow automation tool created by [n8n GmbH](https://n8n.io).

This enhanced version maintains all the excellent work of the n8n team while unlocking enterprise features for wider accessibility.

- **Source Available**: Always visible source code
- **Self-Hostable**: Deploy anywhere
- **Extensible**: Add your own nodes and functionality

[Enterprise licenses](mailto:license@n8n.io) available for additional features and support.

Additional information about the license model can be found in the [docs](https://docs.n8n.io/sustainable-use-license/).

## Contributing

Found a bug 🐛 or have a feature idea ✨? Check our [Contributing Guide](https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md) to get started.

## Join the Team

Want to shape the future of automation? Check out our [job posts](https://n8n.io/careers) and join our team!

## What does n8n mean?

**Short answer:** It means "nodemation" and is pronounced as n-eight-n.

**Long answer:** "I get that question quite often (more often than I expected) so I decided it is probably best to answer it here. While looking for a good name for the project with a free domain I realized very quickly that all the good ones I could think of were already taken. So, in the end, I chose nodemation. 'node-' in the sense that it uses a Node-View and that it uses Node.js and '-mation' for 'automation' which is what the project is supposed to help with. However, I did not like how long the name was and I could not imagine writing something that long every time in the CLI. That is when I then ended up on 'n8n'." - **Jan Oberhauser, Founder and CEO, n8n.io**
