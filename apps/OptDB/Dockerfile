FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon for development
RUN npm install -g nodemon

# Copy source code
COPY . .

# Expose the port (used by the app)
EXPOSE $PORT

# Use nodemon for live reloading
CMD ["nodemon", "app.js"]
