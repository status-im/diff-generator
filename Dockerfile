FROM node:10.14-alpine

WORKDIR /app

COPY package.json ./
RUN yarn install --production

COPY src/ ./

ENV LOG_LEVEL=INFO \
    LISTEN_PORT=8000 \
    DB_SAVE_INTERVAL=5000 \
    DB_PATH='/tmp/builds.db' \

LABEL source="https://github.com/status-im/diff-generator" \
      description="Basic NodeJS API for generating and publishing build diffs." \
      maintainer="jakub@status.im"

CMD ["yarn", "start"]
EXPOSE $LISTEN_PORT
