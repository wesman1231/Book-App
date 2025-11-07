FROM node:22

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Set environment variables
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]