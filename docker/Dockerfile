FROM node:16-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV USER=node

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app
RUN mkdir /usr/src/.npm-global
RUN chown -R node:node /usr/src/.npm-global

ENV PATH=/usr/src/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/usr/src/.npm-global

RUN npm --global config set user "${USER}"
RUN npm i --location=global pm2

COPY package*.json .

RUN npm install --only=production

COPY --from=development /usr/src/app/build /usr/src/app/build

CMD [ "pm2-runtime", "--no-auto-exit", "npm", "--", "run", "docker:start:prod" ]
