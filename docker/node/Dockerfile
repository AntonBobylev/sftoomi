FROM node:26-alpine

ARG USER_ID
ARG GROUP_ID
ARG USER_NAME

RUN deluser node 2>/dev/null || true && \
    delgroup node 2>/dev/null || true

RUN addgroup -g ${GROUP_ID} ${USER_NAME} && \
    adduser -u ${USER_ID} -G ${USER_NAME} -s /bin/sh -D ${USER_NAME}

RUN npm install -g @angular/cli

WORKDIR /var/www/project/app

RUN chown -R ${USER_ID}:${GROUP_ID} /var/www/project

EXPOSE 4200

CMD ["npm", "run", "start"]
