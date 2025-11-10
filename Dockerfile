FROM node:lts-alpine

WORKDIR /app
COPY package-lock.json ./

ADD . ./
RUN npm i

RUN npm run build

EXPOSE 3000
VOLUME [ "/app/.next" ]

ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

COPY ".next/static" ".next/standalone/static"

CMD [ "node", "./.next/standalone/server.js", "--port", "3000", "--host" ]
