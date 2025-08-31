#!/bin/bash

echo "🚀 Starting DSA Game Platform..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   - On macOS: brew services start mongodb-community"
    echo "   - On Ubuntu: sudo systemctl start mongod"
    echo "   - On Windows: net start MongoDB"
    echo ""
    echo "Or use MongoDB Atlas (cloud) and update the connection string in backend/.env"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Seed database if it's empty
echo "🌱 Seeding database..."
cd backend && npm run seed && cd ..

echo "🎮 Starting development servers..."
echo "   - Backend: http://localhost:5000"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Start both servers
npm run dev