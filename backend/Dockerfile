# Use Node.js LTS (Long Term Support) version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set Node.js to run in production mode
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "index.js"]
