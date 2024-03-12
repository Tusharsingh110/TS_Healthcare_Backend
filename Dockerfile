# Use the official Node.js 21-slim image as base
FROM node:21-slim

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Update npm
RUN npm update

# Install dependencies
RUN npm install

# Copy source code to the working directory
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run your application
CMD ["node", "index.js"]
