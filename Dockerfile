FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps
RUN npm install react-app-rewired browserify-zlib crypto-browserify https-browserify stream-browserify stream-http

# Copy the .env.docker file as .env
COPY .env.docker .env

# Copy the rest of the application
COPY . .

# Create symbolic link for public directory to fix webpack issue
RUN ln -sf /app/public /public

# Fix for file resolution in Docker
RUN mkdir -p /app/src/routes

# Development mode setup
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV HOST=0.0.0.0
ENV PORT=3000
ENV WDS_SOCKET_PORT=3001
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
ENV PUBLIC_URL=http://localhost:3001

# Expose port
EXPOSE 3000

# Add a startup script to ensure file paths are correct
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Start the development server
CMD ["/docker-entrypoint.sh"]
