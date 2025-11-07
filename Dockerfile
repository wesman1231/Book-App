FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (Railway will assign via env)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]