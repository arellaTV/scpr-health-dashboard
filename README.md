# SCPR Health Dashboard
> A web application that renders SCPR metrics onto dynamic charts and graphs.

## Table of Contents
1. [Getting Started](#getting-started)
  1. [Installing Dependencies](#installing-dependencies)
  1. [Docker](#docker)
1. [Usage](#usage)
1. [Testing](#testing)

## Getting Started
### Installing Dependencies
From within the root directory:
```sh
$ npm install
```
### Docker
To build from this repo's Dockerfile:
```sh
$ docker build -t scprdev/health-dashboard .
```
To pull the latest image from DockerHub:
```sh
$ docker pull scprdev/health-dashboard
```
## Usage
From within the root directory
```sh
$ npm start
```
Then, open your browser and navigate to [localhost:8080](http://localhost:8080).
To spin up and run a docker container from the image:
```sh
$ docker run -p 8080:8080 scprdev/health-dashboard
```
Then, open your browser and navigate to 'http://{your docker-machine's ip}:8080'
## Testing
From within the root directory:
```sh
$ npm test
```
