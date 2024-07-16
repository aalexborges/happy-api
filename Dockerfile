FROM node:20-alpine AS base

RUN npm i -g pnpm
RUN apk add --no-cache --virtual build-dependencies build-base python3

FROM base as dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile
RUN pnpm rebuild bcrypt

FROM base as development

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

CMD [ "pnpm", "run", "start:dev" ]

FROM base as build

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm run build
RUN pnpm prune --prod

FROM base AS deploy

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD [ "node", "dist/main" ]
