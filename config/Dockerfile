FROM --platform=linux/amd64 node:16.17.1
WORKDIR /yorkie-tldraw
COPY . .
RUN npm install -g npm@9.6.5 \
    && npm install
EXPOSE 80
CMD ["node", "start"]