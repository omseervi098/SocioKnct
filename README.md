
# SocioKnct

A Social Medial Application where user can post,comment and like other post.

## Deployed URL
- <a href="https://socioknct.tech">https://www.socioknct.tech</a>
- <a href="https://socioknct.onrender.com">https://socioknct.onrender.com</a>

## Features
- Realtime Posting Images, Audio , Video, Text and Creating Poll
- Home page consist of widgets of weather, news and user profile
- Google OAuth2.0
- Forget-Password, Email Verification 
- Friend Request System
- Realtime Likes, Comments, Replies
- ChatRooms where two friends can chat (`using Socketio`)
- AutoComplete Search using jquery.
- Notification via email when there is new FriendRequest, new Comment.
- Email Worker (`using Bull.js`) for managing jobs and reducing server load.
 




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- `CODEIAL_SESSION_COOKIE_KEY` {Session Cookie for local authentication}
- `CODEIAL_DB_NAME`   {Database collection name}
- `CODEIAL_ASSET_PATH`  {asset path of js,css,images}
- `CODEIAL_MAILER_USERNAME` {email username for nodemailer}
- `CODEIAL_MAILER_PASSWORD` {email password for nodemailer}
- `CODEIAL_JWT_SECRET_KEY` {JWT key JWT Authenication}
- `CODEIAL_MONGODB_URL` {Cloud MongoDB URL}
- `CODEIAL_GOOGLE_CLIENTID`  {For Google OAuth}
- `CODEIAL_GOOGLE_CLIENTSECRET` {For Google OAuth}
- `CODEIAL_GOOGLE_CALLBACKURL` {For Google OAuth}
- `CODEIAL_REDIS_PASSWORD` {Bull.js require redis database}
- `PORT` { Port where server and socket.io will run}

## Deployment

Depolyed on AWS EC2 and Render.com Server

- Install `node` using `nvm` on aws EC2
- Install `redis`, `pm2`, `nginx`, `gulp` on same
- Minify assets using gulp and start running server using `pm2 start index.js`
  {
    
       `redis` : used by bull.js as email worker that reduce server load and manage jobs
       `pm2` : Better than nodemon because it keep on running even after getting error
       `nginx` : Used as proxy server to balance load on server
       `gulp` : to Minify js,css,images (optimising assets)

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

**Client:** EJS, SCSS, JQuery, Ajax, Bootstrap

**Server:** Node, Express, MongoDB, Redis, SocketIO





## Demo

### Home page of SocioKnct with chat application
![App Screenshot](https://raw.githubusercontent.com/omseervi098/SocioKnct/master/ss/chat-home.png)

### Login/signup/forget password
![App Screenshot](https://raw.githubusercontent.com/omseervi098/SocioKnct/master/ss/loginpage.png)

### Edit profile page
![App Screenshot](https://raw.githubusercontent.com/omseervi098/SocioKnct/master/ss/edit-profile.png)

### View Others profile with their timeline page 
![App Screenshot](https://raw.githubusercontent.com/omseervi098/SocioKnct/master/ss/timeline-profile.png)

### Search user on SocioKnct and send friend request to chat with them
![App Screenshot](https://raw.githubusercontent.com/omseervi098/SocioKnct/master/ss/search.png)

### Also have mailing options for forget password and notifying new comment on user post via email
![App Screenshot](https://raw.githubusercontent.com/omseervi098/SocioKnct/master/ss/mailer.jpg)
