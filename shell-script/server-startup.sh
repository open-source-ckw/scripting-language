#!/bin/bash

# What this script do?
# Need to perform all starup process when docker start and server go live
# Entire domin is hosted in docker container and need to finish all startup process one by one

# Define Docker container names
MAIN_CONTAINER="yourdomin.dev"
MYSQL_CONTAINER="yourdomin_dev_mysql5.7"
POSTGRESQL_18_RC1_BETA_CONTAINER="yourdomin_dev_postgres18"

# Record the start time
START_TIME=$(date +%s)

# Define the path to your PM2 start script inside the container
PM2_SCRIPT_PATH="/home/tenddev/iot/shell-script/startup-pm2-dev.sh"

# Function to start Docker containers
start_container() {
    local container_name=$1
    if [ "$(docker ps -q -f name=$container_name)" ]; then
        echo "Container $container_name is already running."
    else
        echo "Starting Docker container $container_name..."
        docker start $container_name
        sleep 5
    fi
}

# Start Docker containers
start_container $MAIN_CONTAINER
start_container $MYSQL_CONTAINER
start_container $POSTGRESQL_18_RC1_BETA_CONTAINER

# Start essential services inside the main container
echo "Starting essential services inside the main container ($MAIN_CONTAINER)..."
ESSENTIAL_SERVICES=("apache2" "postgresql" "redis-server" "vsftpd" "ssh" "mysql" "cron")
PHP_SERVICES=("php5.6-fpm" "php7.1-fpm" "php7.2-fpm" "php7.3-fpm" "php7.4-fpm" "php8.0-fpm" "php8.1-fpm" "php8.2-fpm" "php8.3-fpm")

# Start essential services
for SERVICE in "${ESSENTIAL_SERVICES[@]}"; do
    echo "Starting $SERVICE..."
    docker exec -d $MAIN_CONTAINER service $SERVICE start
done

# Start PHP services
for PHP in "${PHP_SERVICES[@]}"; do
    echo "Starting $PHP..."
    docker exec -d $MAIN_CONTAINER service $PHP start
done

echo "All essential services have been started!"

# Now start PM2 services inside the container
echo "Starting PM2 services inside the main container ($MAIN_CONTAINER)..."

# Use the variable for PM2 script path
docker exec -u tenddev $MAIN_CONTAINER bash -c "source ~/.bashrc && source ~/.nvm/nvm.sh && $PM2_SCRIPT_PATH"


# Record the end time
END_TIME=$(date +%s)

# Calculate and display the time taken
DIFFERENCE=$((END_TIME - START_TIME))
HOURS=$((DIFFERENCE / 3600))
MINUTES=$(((DIFFERENCE % 3600) / 60))
SECONDS=$((DIFFERENCE % 60))

echo "Script completed in $HOURS hours, $MINUTES minutes, and $SECONDS seconds."
echo "All services and PM2 microservices for each project are now running in the main container with delays."

# Cool section to ask the user's name and display a personalized message
echo -e "\n-----------------------"
echo "Before we finish, what is your name?"
read -t 10 -p "Enter your name: " PERSON_NAME

# Check if the name was entered within 10 seconds
if [[ -z "$PERSON_NAME" ]]; then
    echo -e "\nIt's Okay! Have a fantastic day! 🚀"
else
    echo -e "\nHello, $PERSON_NAME! 🌟"
    echo "You're a rockstar for running this script. Keep being amazing, and have a wonderful day! 🚀"
fi
echo "-----------------------"
