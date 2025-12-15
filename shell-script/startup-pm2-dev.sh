#!/bin/bash

# Process when pm2 get started

# Define the projects with their config files and services
declare -A PROJECTS

# API Projects
# Format as below
# PROJECTS["project_name"]="project_directory_path_till_ecosystem:ecosysetm_file_name:pm2_app_micro_1,pm2_app_micro_2,pm2_app_micro_3"

# Start adding entries from below.
PROJECTS["domain1.com_api"]="/home/osuser/public_html/L/domain1.com/domain1.com_api/ecosystem:test.config.js:domain1_sharedapp,domain1_businessapp,domain1_app"
PROJECTS["domain2.com_api_v1"]="/home/osuser/public_html/N/domain2.com_api_v1/ecosystem/:test.config.js:domain2v1_sharedapp,domain2v1_businessapp,domain2v1_app"
PROJECTS["domain3.com_api"]="/home/osuser/public_html/L/domain3.com/domain3.com_api/ecosystem:test.config.js:domain3_sharedapp,domain3_businessapp,domain3_app"
PROJECTS["domain4.com_api"]="/home/osuser/public_html/U/domain4.com_api/ecosystem:test.config.js:domain4_sharedapp,domain4_businessapp,domain4_app"
PROJECTS["domain5.work_api"]="/home/osuser/public_html/T/domain5.work/domain5.work_api/ecosystem:test.config.js:domain5_work_sharedapp,domain5_work_businessapp,domain5_work_app"
PROJECTS["domain6.desktop_api"]="/home/osuser/public_html/C/careandtreatment.com/domain6.desktop_api/ecosystem:test.config.js:domain6_desktop_sharedapp,domain6_desktop_businessapp,domain6_desktop_app"

# ---------------------------------------------------------------------------------- # 

# WEB Projects
# Format as below
# PROJECTS["project_name"]="project_directory_path_till_ecosystem:ecosysetm_file_name:pm2_app_name"

# Start adding entried from below.
PROJECTS["domain2_web"]="/home/osuser/public_html/N/domain2.com_web:ecosystem.config.js:domain2.com_web"
PROJECTS["domain4_web"]="/home/osuser/public_html/U/domain4.com_web/ecosystem:test.config.js:domain4_web"
PROJECTS["domain1.com_web"]="/home/osuser/public_html/L/domain1.com/domain1.com_web/ecosystem:test.config.js:domain1.com_web"
PROJECTS["domain3_web"]="/home/osuser/public_html/L/domain3.com/domain3.com_web/ecosystem:test.config.js:domain3_web"


# ---------------------------------------------------------------------------------- #
# Entry for redis-commander service. 
PROJECTS["redis-commander"]="/root/public_html/inside.domain5.dev/redis-commander:redis-commander.config.js:redis-commander"


# Start PM2 services
for PROJECT in "${!PROJECTS[@]}"; do
    IFS=":" read -r PROJECT_PATH CONFIG_FILE SERVICES <<< "${PROJECTS[$PROJECT]}"
    IFS="," read -ra SERVICE_ARRAY <<< "$SERVICES"

    echo "Starting services for project: $PROJECT"

    for SERVICE in "${SERVICE_ARRAY[@]}"; do
        echo "Starting PM2 service: $SERVICE..."
        pm2 start "$PROJECT_PATH/$CONFIG_FILE" --only "$SERVICE"
        echo "Service $SERVICE started. Waiting 5 seconds..."
        sleep 5
    done

    echo "All services for $PROJECT started successfully!"
done

echo "All PM2 services started!"
