#!/bin/bash
set -e

export FRAPPE_USER=root

# Start Redis
service redis-server start

# Start Nginx
service nginx start

# Start Frappe in the background
cd /app/p101-bench
bench start --port 8000 &
FRAPPE_PID=$!

# Start Next.js
cd /app/xylor
npm start &
NEXT_PID=$!

# Function to handle shutdown
function shutdown {
    echo "Shutting down services..."
    kill $FRAPPE_PID
    kill $NEXT_PID
    service nginx stop
    service redis-server stop
    exit 0
}

# Trap SIGTERM and SIGINT
trap shutdown SIGTERM SIGINT

# Wait for both processes
wait $FRAPPE_PID $NEXT_PID 