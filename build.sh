#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "Installing root backend dependencies..."
npm install

echo "Building frontend client..."
npm --prefix client install
npm --prefix client run build

echo "Build completed successfully!"
