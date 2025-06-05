# Stage 1: Build the React application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and ensure react-scripts is available globally
RUN npm install -g react-scripts && \
    npm install

# Copy application source
COPY . .

# Set environment variable to disable browserslist update
ENV BROWSERSLIST_IGNORE_OLD_DATA=1
ENV PATH /app/node_modules/.bin:$PATH

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Add nginx configuration for React routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]


