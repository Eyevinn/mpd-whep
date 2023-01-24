FROM node:18

ENV MPD=
ENV WHEP=

ADD . /src
WORKDIR /src
RUN npm install

ENTRYPOINT ["sh", "-c", "npm start $MPD $WHEP"]