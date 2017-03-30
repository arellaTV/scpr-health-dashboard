FROM node:6.10
MAINTAINER Jay Arella (jarella@scpr.org)

# cache node-modules
COPY package.json /tmp/package.json
RUN cd /tmp && npm install

RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 8080

# create a non-root user
RUN groupadd -r nodejs \
    && useradd -m -r -g nodejs nodejs
USER nodejs

# set environment variables
ENV CLIENT_ID=$CLIENT_ID
ENV SCOPE=$SCOPE

CMD [ "npm", "run", "server" ]