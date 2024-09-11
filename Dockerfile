# Use an official Node.js image as a base
FROM node:20

# Set the working directory in the container
WORKDIR /website

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install all dependencies (both dependencies and devDependencies)
RUN npm install

# Install Babel CLI, Webpack, and related tools as devDependencies
RUN npm install -g @babel/cli @babel/core @babel/preset-env
RUN npm install -g @babel/preset-react babel-loader webpack webpack-cli

# Copy the rest of the application code
COPY . .

# Ensure the PATH includes node_modules binaries
ENV PATH /website/node_modules/.bin:$PATH

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
