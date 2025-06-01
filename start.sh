#!/bin/bash

# Start BARTViBa
cd /app/bartviba
python app.py &
BARTVIBA_PID=$!

# Start Bahnar Backend
cd /app/bahnar-backend
npm start &
BACKEND_PID=$!

# Start Bahnar Web
cd /app/bahnar-web
npm start &
WEB_PID=$!

# Wait for any process to exit
wait -n

# Kill all remaining processes
kill $BARTVIBA_PID $BACKEND_PID $WEB_PID 