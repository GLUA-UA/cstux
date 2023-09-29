FROM node:20
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

RUN rm -rf node_modules
RUN npm install --omit=dev

CMD ["npm", "start"]