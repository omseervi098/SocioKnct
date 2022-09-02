
# SocioKnct

A Social Medial Application where user can post,comment and like other post.




## Features

- Google OAuth2.0
- Forget-Password
- Email Verification
- Friend Request System
- Posting Images as well as Text
- Likes
- Comments
- ChatRooms 
- AutoComplete Search 
- Mailer when there is new FriendRequest, new Comment

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  nodemon index.js
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CODEIAL_SESSION_COOKIE_KEY`
`CODEIAL_DB_NAME`
`CODEIAL_ASSET_PATH`
`CODEIAL_MAILER_USERNAME`
`CODEIAL_MAILER_PASSWORD`
`CODEIAL_JWT_SECRET_KEY`

This are for Google OAuth2.0

`CODEIAL_GOOGLE_CLIENTID`
`CODEIAL_GOOGLE_CLIENTSECRET`
`CODEIAL_GOOGLE_CALLBACKURL`




## Tech Stack

**Client:** EJS, SCSS, JS, Ajax

**Server:** Node, Express, MongoDB, Redis


## Deployment

Deployed on AWS EC2 

Link to Website : http://socioknct.tk/

