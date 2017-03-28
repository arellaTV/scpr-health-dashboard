FROM node:6.10
MAINTAINER Jay Arella (jarella@scpr.org)

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]