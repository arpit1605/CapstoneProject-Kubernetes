FROM node:18-alpine
WORKDIR /auth
#PORT=5001
#MONGO_URI='mongodb://mongo:27017/intsheep'
COPY . .
RUN npm install
EXPOSE 5001
CMD [ "node", "index.js" ]
