FROM mongo:4.2.7 AS mongodb
ENV SCHEDULE_PASS="qualis"
ENV SCHEDULE_USER="qualis"
ENV MONGO_INITDB_ROOT_USERNAME="admin"
ENV MONGO_INITDB_ROOT_PASSWORD="admin"
COPY infra/mongodb/initdb /initdb
COPY infra/mongodb/initdb.sh /docker-entrypoint-initdb.d/
COPY infra/mongodb/custom-mongo.conf /etc/custom-mongo.conf
RUN rm -rf shared/infra/http/.env
EXPOSE 27017
CMD ["mongod","--auth", "-f", "/etc/custom-mongo.conf"]

FROM postgres:13-alpine AS postgres
ENV DB_DATABASE="vigilancia"
ENV DB_USERNAME="qualis"
ENV DB_PASS="postgres"
ENV POSTGRES_PASSWORD="postgres"
ENV POSTGRES_USER="postgres"
ENV ESTABLISHMENT_NAME="isa-qualis"
ENV ESTABLISHMENT_EMAIL="@"
ENV ESTABLISHMENT_CNPJ="."
ENV ESTABLISHMENT_PHONE="."
ENV ESTABLISHMENT_CITY="."

COPY infra/postgresql/initdb /docker-entrypoint-initdb.d
FROM node:12.18 AS api

#ESTABLISHMENTS

#keycloak
ENV KEYCLOAK_SERVER_URL=http://keycloak:8080/auth
ENV KEYCLOAK_REALM=isa-qualis
ENV KEYCLOAK_CLIENT=isa-backend
ENV KEYCLOAK_ADMIN_USER=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin
#Config
ENV BASE_URL=http://localhost:3333/
ENV NODE_ENV=development
ENV PORT=3333
ENV FRONT_URL=http://localhost:3000
#Auth
ENV APP_SECRET=SECRET
ENV APP_TOKEN=TOKEN
ENV EXPIRES_IN=1d
#Database
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASS=postgres
ENV DB_DATABASE=vigilancia
#Mongo
ENV MONGO_HOST=mongodb://qualis:qualis@mongodb:27017/agenda
ENV MONGO_COLLECTION=agendaJobs
ENV LOG_HOST=mongodb://qualis:qualis@mongodb:27017/logs
#Server
COPY dist/. src/
WORKDIR /src
ENV MEMORY 1024
ENV API_PORT 8080
CMD node --max-old-space-size=$MEMORY --optimize-for-size --inspect shared/infra/http/server.js
