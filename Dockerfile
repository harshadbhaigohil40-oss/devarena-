FROM node:20-alpine

# Install python3 for the code execution engine
RUN apk add --no-cache python3

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy workspace packages
COPY server ./server
COPY shared ./shared

# Install dependencies (workspaces support)
RUN npm install --omit=dev

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the server using the root script
CMD ["npm", "start"]
