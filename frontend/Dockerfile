FROM node:18.17.0-slim

WORKDIR /app

COPY package.json /app/

RUN npm install --no-package-lock

COPY . .

CMD ["npm", "run", "dev", "--", "--port", "5173", "--host", "0.0.0.0"]