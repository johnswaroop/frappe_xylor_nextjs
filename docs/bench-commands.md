# Essential Bench Commands for ERPNext

## Site Management

- `bench new-site [site-name]` - Create a new site
- `bench new-site [site-name] --mariadb-root-password [password]` - Create site with specific MariaDB root password
- `bench use [site-name]` - Switch to a specific site

## ERPNext Installation

- `bench get-app erpnext --branch version-14` - Download and install specific version of ERPNext
- `bench get-app erpnext --branch develop` - Download and install latest development version
- `bench --site [site-name] install-app erpnext` - Install ERPNext in your site

## Backup and Restore

- `bench --site [site-name] backup --with-files` - Create a backup of the site including files
- `bench --site [site-name] backup --compress` - Create a compressed backup
- `bench --site [site-name] restore [backup-path] --with-files` - Restore site from backup including files
- `bench --site [site-name] restore [backup-path] --force` - Force restore even if site exists

## Server Management

- `bench start` - Start the development server
- `bench stop` - Stop the development server
- `bench restart` - Restart the development server

## App Management

- `bench get-app [app-name]` - Download and install an app
- `bench install-app [app-name]` - Install an app in the current site
- `bench uninstall-app [app-name]` - Uninstall an app from the current site
- `bench update` - Update all apps
- `bench update [app-name]` - Update a specific app

## Development

- `bench make-docs` - Generate documentation
- `bench make-docs --site [site-name]` - Generate documentation for a specific site
- `bench setup requirements` - Install Python dependencies
- `bench setup npm` - Install Node.js dependencies
- `bench build` - Build assets
- `bench watch` - Watch for file changes and rebuild assets

## Database

- `bench --site [site-name] mariadb` - Open MariaDB console
- `bench --site [site-name] set-config [key] [value]` - Set site configuration
- `bench --site [site-name] get-config [key]` - Get site configuration

## Production

- `bench setup production [user]` - Setup production environment
- `bench setup nginx` - Setup Nginx configuration
- `bench setup supervisor` - Setup Supervisor configuration
- `bench setup procfile` - Generate Procfile for process management

## Utilities

- `bench --site [site-name] console` - Open Python console
- `bench --site [site-name] shell` - Open Python shell
- `bench --site [site-name] execute [python-code]` - Execute Python code
- `bench --site [site-name] show-config` - Show site configuration
- `bench --site [site-name] set-maintenance-mode on/off` - Enable/disable maintenance mode

## Help

- `bench --help` - Show help message
- `bench [command] --help` - Show help for specific command
