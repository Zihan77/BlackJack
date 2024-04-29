# Stage 1: Build the Vue application using Node
FROM node:18-alpine as build-stage

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e., the '/app' folder)
COPY . .

# Build the app using Vite for production with minification
RUN npm run build

# Stage 2: Serve the app using nginx
FROM nginx:alpine as production-stage

# Copy the built app from the build-stage to the nginx server directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Optional: If you have a custom nginx.conf, copy it
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 by default
EXPOSE 80

# Start nginx and serve content
CMD ["nginx", "-g", "daemon off;"]
