# Use a smaller and newer Node.js base image
FROM node:18-alpine  

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
# Copy all project files
COPY . .

# Set environment variables
ENV PORT=8000
ENV JWT_KEY=auth

# Expose the application port
EXPOSE 8000

# Start the application
CMD [ "npm", "start" ]
