#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "Building frontend client..."
npm --prefix client install
npm --prefix client run build

echo "Installing backend server dependencies..."
npm --prefix server install

echo "Build completed successfully!"
