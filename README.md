
# SocioKnct

A Social Medial Application where user can post,comment and like other post.



## Features

- Google OAuth2.0
- Forget-Password, Email Verification 
- Friend Request System
- Posting Images as well as Text
- Likes, Comments
- ChatRooms where two friends can chat (`Socketio`)
- AutoComplete Search using jquery.
- Notification via mail when there is new FriendRequest, new Comment.
- Email Worker (`Bull`) for managing jobs and reducing server load.
 




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- `CODEIAL_SESSION_COOKIE_KEY`
- `CODEIAL_DB_NAME`   {Database collection name}
- `CODEIAL_ASSET_PATH`  {asset path of js,css,images}
- `CODEIAL_MAILER_USERNAME` {mailer username for nodemailer}
- `CODEIAL_MAILER_PASSWORD` {mailer password for nodemailer}
- `CODEIAL_JWT_SECRET_KEY` {JWT key JWT Authenication}
- `CODEIAL_MONGODB_URL` {Cloud MongoDB URL}
- `CODEIAL_GOOGLE_CLIENTID`  {For Google OAuth}
- `CODEIAL_GOOGLE_CLIENTSECRET` {For Google OAuth}
- `CODEIAL_GOOGLE_CALLBACKURL` {For Google OAuth}


## Deployment

Depolyed on AWS EC2 Server

- Install `node` using `nvm` on aws EC2
- Install `redis`, `pm2`, `nginx`, `gulp` on same
- Minify assets using gulp and start running server using `pm2 start index.js`
  
  {
    
       `redis` : used for email worker that is reduce server load and to manage jobs using `Bull` Library
       `pm2` : Better than nodemon because it keep on running even after getting error
       `nginx` : Used as proxy server to balance load on server
       `gulp` : to Minify js,css,images

  }
## Run Locally

Clone the project

```bash
  git clone https://github.com/omseervi098/SocioKnct
```

Go to the project directory

```bash
  cd SocioKnct
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  nodemon index.js
```


## Tech Stack

**Client:** EJS, SCSS, JS, Ajax

**Server:** Node, Express, MongoDB, Redis


## Demo

- Preview: http://socioknct.tech/

