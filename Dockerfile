# Use node:alpine as the base image
FROM node:18.15-alpine

# Set the working directory
WORKDIR /usr/src

# Copy all necessary files to the working directory
COPY . .

# Install global dependencies
RUN npm install -g pnpm

# Install project dependencies
RUN pnpm install

# Build the project
RUN pnpm run build

# Copy the hack directory to the container
COPY hack ./

# Set environment variables
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production LANG=C.UTF-8

# Expose the port the app runs on
EXPOSE $PORT

# Ensure the entrypoint script is executable
RUN chmod +x ./docker-entrypoint.sh

# Set the command to run when the container starts
CMD ["/bin/sh", "docker-entrypoint.sh"]