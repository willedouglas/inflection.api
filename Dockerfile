FROM node:10.12.0

WORKDIR /home/api/adfinance

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD npm start