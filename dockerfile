# ==========================================
# Stage 1: Build the React application
# ==========================================
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the app for production
# NOTE: If you are using Create React App, the output folder is 'build'. 
# If you are using Vite, the output folder is typically 'dist'.
RUN npm run build

# ==========================================
# Stage 2: Serve the app with Nginx
# ==========================================
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built assets from the build stage
# Change '/app/dist' to '/app/build' if you are using Create React App
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration to support React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]