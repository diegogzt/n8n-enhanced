#!/bin/bash

# n8n Enhanced Edition - Auto Installer Script
# This script automates the installation process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  🚀 n8n Enhanced Edition - Auto Installer"
    echo "  All Enterprise Features Unlocked"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("Docker")
    fi
    
    if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
        missing_deps+=("Docker Compose")
    fi
    
    if ! command_exists git; then
        missing_deps+=("Git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        echo ""
        echo "Please install the missing dependencies:"
        echo "  - Docker: https://docs.docker.com/get-docker/"
        echo "  - Docker Compose: https://docs.docker.com/compose/install/"
        echo "  - Git: https://git-scm.com/downloads"
        exit 1
    fi
    
    print_success "All prerequisites met"
}

# Check Docker version
check_docker_version() {
    print_info "Checking Docker version..."
    
    local docker_version=$(docker version --format '{{.Server.Version}}' 2>/dev/null | cut -d. -f1)
    
    if [ "$docker_version" -lt 20 ]; then
        print_warning "Docker version is below 20. Please update Docker for best compatibility."
    else
        print_success "Docker version OK: $(docker version --format '{{.Server.Version}}')"
    fi
}

# Clone repository
clone_repository() {
    print_info "Cloning n8n Enhanced repository..."
    
    if [ -d "n8n-enhanced" ]; then
        print_warning "Directory 'n8n-enhanced' already exists"
        read -p "Do you want to remove it and clone again? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf n8n-enhanced
            print_success "Removed existing directory"
        else
            print_info "Using existing directory"
            cd n8n-enhanced
            return
        fi
    fi
    
    # Replace with your repository URL
    local repo_url="https://github.com/yourusername/n8n-enhanced.git"
    
    read -p "Enter repository URL (default: $repo_url): " custom_url
    if [ ! -z "$custom_url" ]; then
        repo_url="$custom_url"
    fi
    
    git clone "$repo_url" n8n-enhanced
    cd n8n-enhanced
    print_success "Repository cloned"
}

# Configure environment
configure_environment() {
    print_info "Configuring environment..."
    
    if [ -f ".env" ]; then
        print_warning ".env file already exists"
        read -p "Do you want to reconfigure? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Using existing .env file"
            return
        fi
    fi
    
    echo ""
    echo "══════════ Environment Configuration ══════════"
    echo ""
    
    # Database password
    read -sp "Enter PostgreSQL password (min 8 chars): " db_password
    echo
    while [ ${#db_password} -lt 8 ]; do
        print_error "Password too short. Please enter at least 8 characters."
        read -sp "Enter PostgreSQL password (min 8 chars): " db_password
        echo
    done
    
    # Encryption key
    print_info "Generating encryption key..."
    encryption_key=$(openssl rand -base64 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
    
    # Timezone
    local default_tz="America/New_York"
    read -p "Enter timezone (default: $default_tz): " timezone
    timezone=${timezone:-$default_tz}
    
    # External URL (optional)
    read -p "Enter external URL for webhooks (optional, press Enter to skip): " webhook_url
    
    # Create .env file
    cat > .env << EOF
# n8n Enhanced Edition - Environment Configuration
# Generated on $(date)

# Database
POSTGRES_USER=n8n
POSTGRES_PASSWORD=$db_password
POSTGRES_DB=n8n

# n8n Basic
N8N_BASIC_AUTH_ACTIVE=false
N8N_ENCRYPTION_KEY=$encryption_key

# Timezone
GENERIC_TIMEZONE=$timezone
TZ=$timezone

# Security
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
N8N_BLOCK_ENV_ACCESS_IN_NODE=false

# Optional: Task Runners
N8N_RUNNERS_ENABLED=true

# Optional: External URL
EOF

    if [ ! -z "$webhook_url" ]; then
        echo "WEBHOOK_URL=$webhook_url" >> .env
        echo "N8N_HOST=$(echo $webhook_url | sed 's|https\?://||')" >> .env
        echo "N8N_PROTOCOL=https" >> .env
    fi
    
    print_success "Environment configured"
}

# Build Docker image
build_image() {
    print_info "Building Docker image (this may take several minutes)..."
    
    docker-compose build --no-cache
    
    if [ $? -eq 0 ]; then
        print_success "Docker image built successfully"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
}

# Start services
start_services() {
    print_info "Starting services..."
    
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        print_success "Services started"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

# Wait for n8n to be ready
wait_for_n8n() {
    print_info "Waiting for n8n to be ready..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose logs n8n-enhanced 2>/dev/null | grep -q "n8n ready"; then
            print_success "n8n is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    echo ""
    print_warning "Timeout waiting for n8n. Check logs with: docker-compose logs -f n8n-enhanced"
}

# Show final information
show_final_info() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  ✅ Installation Complete!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    print_success "n8n Enhanced is now running"
    echo ""
    echo "Access your n8n instance at:"
    echo "  🌐 http://localhost:5678"
    echo ""
    echo "Next steps:"
    echo "  1. Open http://localhost:5678 in your browser"
    echo "  2. Create your admin account"
    echo "  3. Explore all Enterprise features (all unlocked!)"
    echo ""
    echo "Useful commands:"
    echo "  • View logs:        docker-compose logs -f n8n-enhanced"
    echo "  • Stop services:    docker-compose stop"
    echo "  • Start services:   docker-compose start"
    echo "  • Restart services: docker-compose restart"
    echo "  • Remove all:       docker-compose down -v"
    echo ""
    echo "🎉 Enjoy n8n Enhanced with all Enterprise features!"
    echo ""
    echo "⚠️  Remember: This is for educational purposes only."
    echo "    For production, consider official n8n Enterprise license."
    echo ""
    echo "═══════════════════════════════════════════════════════════"
}

# Main installation flow
main() {
    print_header
    
    # Run installation steps
    check_prerequisites
    check_docker_version
    
    read -p "Continue with installation? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_info "Installation cancelled"
        exit 0
    fi
    
    clone_repository
    configure_environment
    
    read -p "Start building and deploying now? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_info "You can build and deploy later with:"
        echo "  cd n8n-enhanced"
        echo "  docker-compose up -d"
        exit 0
    fi
    
    build_image
    start_services
    wait_for_n8n
    show_final_info
}

# Trap errors
trap 'print_error "Installation failed. Check the output above for details."' ERR

# Run main function
main "$@"
