#!/bin/bash

# Start BARTViBa
echo "Starting BARTViBa..."
cd /app/bartviba
python app.py &
BARTVIBA_PID=$!

# Start Bahnar Backend
echo "Starting Bahnar Backend..."
cd /app/bahnar-backend
npm start &
BACKEND_PID=$!

# Start Bahnar Web
echo "Starting Bahnar Web..."
cd /app/bahnar-web
npm start &
WEB_PID=$!

# Function to handle cleanup on exit
cleanup() {
  echo "Shutting down services..."
  kill $BARTVIBA_PID $BACKEND_PID $WEB_PID
  wait
  echo "All services stopped."
}

# Trap termination signals to gracefully shutdown
trap cleanup SIGINT SIGTERM

# Wait for any process to exit
wait -n

# Cleanup if any process exits
cleanup
