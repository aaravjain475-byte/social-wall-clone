#!/bin/bash

echo "Setting up Social Wall Clone project..."

echo ""
echo "Installing frontend dependencies..."
npm install

echo ""
echo "Installing date-fns for time formatting..."
npm install date-fns

echo ""
echo "Setup complete!"
echo ""
echo "To start the project:"
echo "1. Open terminal and run: npm run dev"
echo "2. Open another terminal and run: npm run server"
echo "3. Open http://localhost:3000 in your browser"
echo ""

echo "Starting both servers now..."
echo "Starting API server in background..."
npm run server &

echo "Starting frontend server..."
npm run dev
