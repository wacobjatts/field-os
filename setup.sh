#!/bin/bash

echo "Starting FieldOS setup..."

sudo apt update -y
sudo apt upgrade -y

echo "Installing core tools..."
sudo apt install -y curl git

echo "FieldOS setup complete."
