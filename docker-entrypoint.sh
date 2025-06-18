#!/bin/bash
set -e

export FRAPPE_USER=frappe

# Start Redis
service redis-server start

# Start Nginx
service nginx start

# Change ownership of required directories
chown -R frappe:frappe /app/p101-bench
chown -R frappe:frappe /app/xylor

# Start Frappe in the background
cd /app/p101-bench
su -c "bench start --port 8000" frappe &
FRAPPE_PID=$!

# Start Next.js
cd /app/xylor
su -c "npm start" frappe &
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