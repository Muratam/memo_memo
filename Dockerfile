FROM alpine:latest
# @ build
RUN apk add --no-cache nodejs git openssh && \
    npm install pm2 -g && \
    cd ~ && \
    git clone https://github.com/Muratam/memo_memo.git && \
    cd memo_memo && \
    npm install && \
    npm run build

# @ run
# CMD node ~/memo_memo/server/server.js
CMD pm2 --no-daemon start ~/memo_memo/server/server.js

EXPOSE 8080
