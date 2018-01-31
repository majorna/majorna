FROM node:9

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]
