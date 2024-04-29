# Use a Node.js base image
FROM node:18-alpine as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# Build your app if necessary (this part depends on your project setup)
RUN npm run build

# The final stage, using a clean image to keep the image size small
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /home/node/app

# Copy the build directory from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the node_modules directory from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Your app uses port 3000
EXPOSE 3000

# Start the server
CMD ["node", "dist/src/server.js"]

