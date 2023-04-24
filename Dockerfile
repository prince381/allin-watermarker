FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN yarn install

RUN apk update
RUN apk add
RUN apk add ffmpeg

# RUN apt update && apt install ffmpeg -y

# RUN wget https://www.johnvansickle.com/ffmpeg/old-releases/ffmpeg-4.4.1-arm64-static.tar.xz &&\
#     tar xvf ffmpeg-4.4.1-arm64-static.tar.xz &&\
#     mv ffmpeg-4.4.1-arm64-static/ffmpeg /usr/bin/ &&\
#     mv ffmpeg-4.4.1-arm64-static/ffprobe /usr/bin/

# RUN apt-get -y update && apt-get -y upgrade && apt-get install -y --no-install-recommends ffmpeg

# Bundle app source
COPY . .

EXPOSE 8080

ENV NODE_ENV=development
ENV PORT=8080
ENV ORIGIN=*

CMD [ "yarn", "start" ]