FROM node:lts-alpine
ENV NODE_ENV production
ENV PORT 4000
ENV DATABASE_URL ''
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE ${PORT}:4000
CMD npm start