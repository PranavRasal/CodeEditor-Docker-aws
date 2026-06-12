#build the frontend dist folder
#copy the dist folder content in backend /public folder

FROM node:20-alpine AS frontend_builder

COPY ./Frontend /app 

WORKDIR /app

RUN npm install

RUN npm run build

# build the backend folder

FROM node:20-alpine 

COPY ./Backend /app

WORKDIR /app

RUN npm install

# copy the dist folder content from frontend builder to backend public folder

COPY --from=frontend_builder /app/dist /app/public

CMD ["node", "server.js"]
