FROM node:18-alpine as builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build

FROM node:18-alpine AS server
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production
COPY --from=builder ./app/dist ./dist
EXPOSE 3501
CMD ["yarn", "start"] 
