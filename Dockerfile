FROM node:10.12.0

WORKDIR /home/api/adfinance

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD npm start