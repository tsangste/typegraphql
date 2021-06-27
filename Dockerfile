FROM node:14.17.0-slim

ENV APPDIR /usr/app

RUN mkdir -p ${APPDIR}

RUN apt-get update && apt-get install -y unzip
WORKDIR ${APPDIR}

COPY package.json .
COPY package-lock.json .

RUN npm install

ENV PORT 80
EXPOSE 80

CMD ["npm", "start"]
