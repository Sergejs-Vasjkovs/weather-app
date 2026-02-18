FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
COPY ./prisma /app/prisma
COPY ./prisma.config.ts /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=production-dependencies-env /app/generated /app/generated
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/prisma /app/prisma
COPY --from=build-env /app/prisma.config.ts /app/
WORKDIR /app
RUN npm install prisma --no-save
CMD ["sh", "-c", "npx prisma db push && npm run start"]