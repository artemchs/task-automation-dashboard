#!/bin/bash

echo "🚀 Starting PostgreSQL database container..."

# Container configuration
CONTAINER_NAME="task-automation-db"
DB_NAME="fastdev"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_PORT=5432

# Cleanup existing container
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🧹 Cleaning up existing container..."
    docker rm -f $CONTAINER_NAME >/dev/null 2>&1
fi

# Start container
docker run --name $CONTAINER_NAME \
    -e POSTGRES_DB=$DB_NAME \
    -e POSTGRES_USER=$DB_USER \
    -e POSTGRES_PASSWORD=$DB_PASSWORD \
    -p $DB_PORT:5432 \
    -v ${CONTAINER_NAME}-data:/var/lib/postgresql/data \
    --health-cmd "pg_isready -U postgres" \
    --health-interval 5s \
    --health-timeout 5s \
    --health-retries 5 \
    -d postgres:16-alpine >/dev/null 2>&1

# Check if container started successfully
if [ $? -ne 0 ]; then
    echo "❌ Failed to start PostgreSQL container"
    exit 1
fi

echo "⏳ Waiting for PostgreSQL to be ready..."
while ! docker exec $CONTAINER_NAME pg_isready -U postgres >/dev/null 2>&1; do
    sleep 1
done

echo "✅ PostgreSQL is running!"
echo "📝 Connection details:"
echo "  Host: localhost"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  Username: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Connection URL: postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME"