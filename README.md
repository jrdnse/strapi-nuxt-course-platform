# Strapi + Nuxt Online Course Platform

## Set up

Go see the separate README.md-files in `/web` & `/app` to setup this platform locally for the first time.

## Quick start

### Front-end Web

Works on `node -v 12.16.3`, NOT `node -v v14.2.0`

1. `cd /web`
2. `cp .env.EXAMPLE .env`
3. `npm i`
4. `npm run dev`

Then also start the back-end API via docker.
And open http://localhost:3000/

### Back-end App

You must have docker installed

1. `cd` to repo root (outside of `./app`)
2. `docker-compose up`

Then open http://localhost:1337/admin

You can also start the app from the docker desktop window.

Thanks to @Knogobert for the ReadMe
