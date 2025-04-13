#!/bin/bash

sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
  echo "➜ Changing to project directory: $PROJECT_DIR"
  cd "$PROJECT_DIR" || { echo "❌ Failed to cd into $PROJECT_DIR"; exit 1; }

#   echo "➜ Running npm build..."
#   npm run build || { echo "❌ Build failed"; exit 1; }

  # Use expect to automatically enter passphrase for git pull
  if ! command -v expect &> /dev/null; then
    echo "⚠️ 'expect' not found. Installing..."
    sudo apt-get update && sudo apt-get install -y expect
  fi

  echo "➜ Pulling latest changes from Git..."
  /usr/bin/expect << EOG
    spawn git pull origin main
    expect "Enter passphrase for key*"
    send "$GIT_PASSPHRASE\r"
    expect eof
    catch wait result
    exit [lindex \$result 3]
EOG

  echo "➜ Checking Node.js availability..."
  command -v node || { echo "❌ Node.js not found in PATH"; exit 1; }
  node -v

  echo "➜ Installing dependencies..."
  npm install || { echo "❌ npm install failed"; exit 1; }

  echo "➜ Running production build..."
  npm run build || { echo "❌ Build failed"; exit 1; }

  echo "✅ Deployment completed successfully!"
EOF

# Check if SSH command succeeded
if [ \$? -ne 0 ]; then
  echo "❌ Deployment failed!"
  exit 1
fi
