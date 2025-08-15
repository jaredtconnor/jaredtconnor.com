#!/bin/bash

# Cleanup script for SST environments and resources
# Usage: ./scripts/cleanup.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to confirm action
confirm() {
    read -p "$(echo -e ${YELLOW}$1${NC} [y/N]): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to remove SST environment
remove_sst_environment() {
    local stage=$1
    print_status "Removing SST environment: $stage"
    
    if confirm "Are you sure you want to remove the '$stage' environment? This will delete all AWS resources."; then
        print_status "Removing SST stage: $stage"
        pnpm sst remove --stage "$stage"
        print_success "Successfully removed '$stage' environment"
    else
        print_warning "Skipped removal of '$stage' environment"
    fi
}

# Function to clean local development files
clean_local() {
    print_status "Cleaning local development files..."
    
    # Remove build outputs
    find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name ".astro" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "tsconfig.tsbuildinfo" -type f -delete 2>/dev/null || true
    
    # Remove SST local files (keep secrets)
    if [ -d ".sst" ]; then
        if confirm "Remove .sst directory (this will keep secrets but remove local SST state)?"; then
            rm -rf .sst
            print_success "Removed .sst directory"
        fi
    fi
    
    print_success "Local cleanup completed"
}

# Function to clean node_modules
clean_dependencies() {
    print_status "Cleaning node_modules..."
    
    if confirm "Remove all node_modules directories and reinstall?"; then
        # Remove all node_modules
        find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
        
        # Reinstall dependencies
        print_status "Reinstalling dependencies..."
        pnpm install
        
        print_success "Dependencies cleaned and reinstalled"
    else
        print_warning "Skipped dependency cleanup"
    fi
}

# Function to list SST environments
list_environments() {
    print_status "Listing SST environments..."
    
    # Try to list SST environments
    if command -v sst &> /dev/null; then
        echo -e "\n${BLUE}Available SST stages:${NC}"
        pnpm sst list 2>/dev/null || print_warning "Could not list SST stages (run 'pnpm sst list' manually)"
    else
        print_error "SST CLI not available"
    fi
}

# Function to show help
show_help() {
    echo "Cleanup script for SST environments and local files"
    echo
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  development     Remove development environment"
    echo "  staging         Remove staging environment"
    echo "  jaredconnor     Remove old 'jaredconnor' environment"
    echo "  local           Clean local development files"
    echo "  deps            Clean and reinstall dependencies"
    echo "  list            List available SST environments"
    echo "  help            Show this help message"
    echo
    echo "Examples:"
    echo "  $0 development              # Remove development environment"
    echo "  $0 local                    # Clean local files"
    echo "  $0 deps                     # Clean and reinstall dependencies"
    echo
}

# Main script logic
case "${1:-}" in
    "development")
        remove_sst_environment "development"
        ;;
    "staging")
        remove_sst_environment "staging"
        ;;
    "jaredconnor")
        print_warning "Removing old 'jaredconnor' environment"
        remove_sst_environment "jaredconnor"
        ;;
    "local")
        clean_local
        ;;
    "deps")
        clean_dependencies
        ;;
    "list")
        list_environments
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        # Interactive mode
        echo -e "${BLUE}SST Environment Cleanup Tool${NC}"
        echo
        echo "What would you like to clean up?"
        echo
        echo "1) Remove 'jaredconnor' environment (recommended)"
        echo "2) Remove 'development' environment"
        echo "3) Remove 'staging' environment"
        echo "4) Clean local development files"
        echo "5) Clean and reinstall dependencies"
        echo "6) List environments"
        echo "7) Exit"
        echo
        read -p "Choose an option (1-7): " choice
        
        case $choice in
            1) remove_sst_environment "jaredconnor" ;;
            2) remove_sst_environment "development" ;;
            3) remove_sst_environment "staging" ;;
            4) clean_local ;;
            5) clean_dependencies ;;
            6) list_environments ;;
            7) print_status "Exiting..." ;;
            *) print_error "Invalid option" ;;
        esac
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac

print_success "Cleanup script completed!"