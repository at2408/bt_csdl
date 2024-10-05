# Use the official MongoDB image from the Docker Hub
FROM mongo:latest

# Copy the initialization script (JavaScript) to the docker-entrypoint-initdb.d directory
COPY init-mongo.js /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017

# Set the default command to run MongoDB
#CMD ["mongod"]
