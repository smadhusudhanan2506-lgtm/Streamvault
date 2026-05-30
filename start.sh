#!/bin/bash
# StreamVault - Quick Start Script

echo "🎬 StreamVault - Starting up..."
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
  echo "⚠️  No .env file found in backend/"
  echo "   Copy backend/.env.example to backend/.env and fill in your Gmail credentials"
  echo ""
  echo "   cp backend/.env.example backend/.env"
  echo "   nano backend/.env"
  echo ""
  read -p "Continue anyway? (y/n): " choice
  [ "$choice" != "y" ] && exit 1
fi

# Start backend
echo "🚀 Starting backend on port 5000..."
cd backend && node server.js &
BACKEND_PID=$!
cd ..

sleep 1

# Start frontend dev server
echo "🌐 Starting frontend on port 5173..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ StreamVault is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" INT
wait
