#!/usr/bin/env python
"""
Setup script for PWA Backend
"""
import os
import sys
import subprocess
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors"""
    print(f"Running: {description}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False


def create_env_file():
    """Create .env file with default values"""
    env_content = """# Django Settings
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True

# Encryption Settings
ENCRYPTION_KEY=your-32-byte-encryption-key-change-in-production

# Database Settings (SQLite by default)
DATABASE_URL=sqlite:///db.sqlite3
"""
    
    env_file = Path('.env')
    if not env_file.exists():
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ Created .env file with default values")
    else:
        print("ℹ️  .env file already exists")


def main():
    """Main setup function"""
    print("🚀 Setting up PWA Backend...")
    
    # Check if we're in the right directory
    if not Path('manage.py').exists():
        print("❌ Error: manage.py not found. Please run this script from the pwa_backend directory.")
        sys.exit(1)
    
    # Create virtual environment
    if not Path('venv').exists():
        print("📦 Creating virtual environment...")
        if not run_command('python -m venv venv', 'Creating virtual environment'):
            sys.exit(1)
    
    # Activate virtual environment and install dependencies
    print("📦 Installing dependencies...")
    if os.name == 'nt':  # Windows
        install_cmd = 'venv\\Scripts\\activate && pip install -r requirements.txt'
    else:  # Unix/Linux/macOS
        install_cmd = 'source venv/bin/activate && pip install -r requirements.txt'
    
    if not run_command(install_cmd, 'Installing dependencies'):
        sys.exit(1)
    
    # Create .env file
    create_env_file()
    
    # Run migrations
    print("🗄️  Setting up database...")
    if os.name == 'nt':  # Windows
        migrate_cmd = 'venv\\Scripts\\activate && python manage.py makemigrations && python manage.py migrate'
    else:  # Unix/Linux/macOS
        migrate_cmd = 'source venv/bin/activate && python manage.py makemigrations && python manage.py migrate'
    
    if not run_command(migrate_cmd, 'Running database migrations'):
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Activate virtual environment:")
    if os.name == 'nt':
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("2. Start the development server:")
    print("   python manage.py runserver")
    print("3. Visit http://localhost:8000/admin/ to create a superuser")
    print("4. API will be available at http://localhost:8000/api/")
    print("\n📚 Check README.md for detailed API documentation and frontend integration examples.")


if __name__ == '__main__':
    main() 