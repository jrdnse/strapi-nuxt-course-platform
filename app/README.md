# Back-end App

## Quick start

You must have docker installed

1. CD to repo root (outside of `./app`)
2. `docker-compose up`

Then open http://localhost:1337/admin

You can also start the app from the docker desktop window.

## Build setup

If you're starting this for the first time:

1. You have to register an admin account on http://localhost:1337/admin/auth/register first.

2. Then activate Linkedin2 provider on http://localhost:1337/admin/plugins/users-permissions/providers and put in the id and secrets from the linkedin dev api.
   Also change the 'redirect URL' to the front-end callback (eg. http://localhost:3000/auth/connect/linkedin)

3. Then setup the roles & permissions http://localhost:1337/admin/plugins/users-permissions/roles
   Go to "Authenticated" and select all the permission checkboxes with "find" & "findOne". At the same "Authenticated" user role, scroll down to the "USERS-PERMISSIONS" part and make sure these are selected:

```js
  {
    Auth: ['connect'],
    User: ['checkexamcooldown', 'checkexamquestion', 'me', 'startexam', 'submitexam', 'updatemyself'],
    Userspermissions: ['init'],
  }
```

Now you should be able to login on the front-end via LinkedIn.

## Initializing the database

### Create a course

1. Add a Lesson
2. Add a Course
3. Add a Chapter and relate it with a lesson

## GraphQL playground

1. Go to http://localhost:1337/graphql
2. Add your authorization bearer token to "HTTP Headers" (in the bottom left) as

```json
{ "authorization": "Bearer eyJ..." }
```

3. Add a query (example below)

Try with copying everything from `web/apollo/queries/lesson.gql` and then add this to the "Query variables" (in the bottom left)

```json
{ "slug": "lesson-1" }
```

Thanks to @Knogobert for the ReadMe
