FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install sequelize sequelize-cli pg -g
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 4000
CMD npm run migrate && npm run seed && npm start


