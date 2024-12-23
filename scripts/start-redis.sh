#!/bin/bash

echo "🚀 Starting Redis container..."

# Container configuration
CONTAINER_NAME="task-automation-redis"
REDIS_PORT=6379

# Cleanup existing container
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🧹 Cleaning up existing container..."
    docker rm -f $CONTAINER_NAME >/dev/null 2>&1
fi

# Start container
docker run --name $CONTAINER_NAME \
    -p $REDIS_PORT:6379 \
    -v ${CONTAINER_NAME}-data:/data \
    --health-cmd "redis-cli ping || exit 1" \
    --health-interval 5s \
    --health-timeout 5s \
    --health-retries 5 \
    -d redis:7-alpine >/dev/null 2>&1

# Check if container started successfully
if [ $? -ne 0 ]; then
    echo "❌ Failed to start Redis container"
    exit 1
fi

echo "⏳ Waiting for Redis to be ready..."
while ! docker exec $CONTAINER_NAME redis-cli ping >/dev/null 2>&1; do
    sleep 1
done

echo "✅ Redis is running!"
echo "📝 Connection details:"
echo "  Host: localhost"
echo "  Port: $REDIS_PORT"
echo "  Connection URL: redis://localhost:$REDIS_PORT"