FROM --platform=linux/amd64 node:16.17.1
WORKDIR /webrtc
COPY . .
RUN npm install -g npm@9.6.6 \
    && npm install
EXPOSE 25000
CMD ["npm", "start"]