FROM node:18-alpine
WORKDIR /auth
#PORT=5000
#MONGO_URI='mongodb://mongo:27017/intsheep'
COPY . .
RUN npm install
EXPOSE 5000
CMD [ "node", "index.js" ]
