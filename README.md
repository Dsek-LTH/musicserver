# Music server

Non-commercial music server which is to be used for playing, selecting, and performing actions on Spotify which is being hosted on 1 device. To use this, the user needs to have a premium Spotify account.

Sites:
<br>
[music.dsek.se](https://music.dsek.se/)

## Getting Started

First, install all dependencies used in the project:

```bash
npm i
```

### Environment variables
There are couple environment variables which needs to be set up before running the website.

+ CLIENT_ID: Spotify client id, need to set up an account at Spotify developer portal and get it from there
+ BASE_URL: URL for the website, used for creating redirect_uri
+ DEV_BASE_URL: Developer URL, used to provide an alternate URL for redirect_uri used in Spotify authentication. Helpful for development on localhost
+ KEYCLOAK_BASE_URL: Base URL for open id authentication for keycloak
+ KEYCLOAK_REALM: The keycloak realm the user will be authenticating for
+ KEYCLOAK_CLIENT: The keycloak client the user will be authenticating through

Then finally, run following to start a development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If you wish to build, then run the following:
```bash
npm run build
```
