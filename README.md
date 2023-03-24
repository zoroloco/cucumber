# d

## Description

This project consists of two sub-projects and is full stack typescript and secured Auth0

- A ReactJS front-end called SPA
- A Nest JS back-end called API

The first thing you need to do to run these projects is to create a new file in the root directory of this project (same place as this readme) and call it .env

> REACT_APP_CLIENTID={client id setup from Auth0}
> REACT_APP_DOMAIN={domain setup from Auth0}
> REACT_APP_API_URL=localhost
> REACT_APP_API_PORT=3001
> AUTH0_AUDIENCE=api://default
> API_DB_HOST=
> API_DB_USERNAME=
> API_DB_PASSWORD=
> API_DB_NAME=

### API

The API project makes a connection to the ODS database configured in the environment file. It provides
an endpoint to get a list of all active users in the Nexus application. This API makes use of swagger and
all the endpoint definitions can be seen at: <http://localhost:3001/api>

Here is a reference to some NestJS documentation: <https://docs.nestjs.com/>

**Note**: The endpoint to fetch the Nexus users is a secure endpoint that requires a valid access token from Okta.

There are 3 different ways to run this API project.

1. ./api/build-run-dev.sh
2. ./api/build-docker.sh followed by ./api/run-docker.sh
3. ./up.sh

Method 1 is good for development.  You make your code changes and run this script and you can run your API and see the
results on <http://localhost:3001>

Method 2 will build a docker image and run it. You can access it at: <http://localhost:3001>

Method 3 will build a docker image for both the API and SPA and run it all.  You can access the site at: <http://localhost>

### SPA

The SPA project is a super simple react js application that uses react bootstrap for some of its components. Its routes are
secure and require an Okta access token.  When you run the app you will see a login button.  Clicking this will redirect you
to the Caris Okta login page.  Once you have successfully entered your credentials, then you are redirected back to your original requested page. If you setup the ODS-related environment variables, then clicking on the Nexus link in the menu will work.

Running the SPA works similar to the API, except the development script runs it on port 3000 which is the default for react-scripts. With this you can make your changes to the UI in real-time. Unfortunately, the Okta redirect URIs for this client are configured only for port 80.  So this whole app works if you run it via docker or if you add

PORT=80

to the .env file and run with elevated privileges.
