FROM --platform=linux/amd64 node:16.17.1
WORKDIR /backend
COPY . .
RUN npm install -g npm@9.6.5 \
    && npm install
EXPOSE 28080
CMD ["node", "app.js"]