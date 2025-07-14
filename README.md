### Snipr – Snippets of Tech News

A local tech-news aggregator. Fetches today’s articles, stores them in PostgreSQL, and lets you like, dislike, or save for later.

### Prerequisites
- Node.js ≥ 14  
- npm ≥ 6  
- PostgreSQL (running & accessible)

### Installation

#### Server
1. Clone the repo  
   ```sh
   git clone https://github.com/matteggers/snipr.git

## Install dependencies

1. Server
```
  cd snipr/server/src
  npm install
```
2. Client
```
  cd snipr/client/src
  npm install
```

## Usage

```
  cd snipr/server/src
  npm run dev

In a separate terminal
  cd snipr/client/serc
  npm run start

```

Also need to setup your pg db and make an env file with the username, password, and db name for the backend to use. Save in format according to the db config file vars

### Architecture
* App starts and user is brought to home page
* DB queried for articles created today, if none available, fetch from NewsAPI. Save them in db, then query them and send to frontend.
* Client then displays articles and provides buttons for liking, disliking, and reading later. Buttons then alter number of likes and set read later to true if selected.

## Screenshots

### Home Page w/ Articles
![Home page of snipr](./images/home_page.png)

### Likes Page
![Likes page of snipr](./images/liked.png)

### Read Later
![Read later page of snipr](./images/read_later.png)




# Burnout
Although this project isn't massive, I realized I wouldn't actually use this tool. Although demotivated, I continued. Learned a lot about file structuring, making code modular so it doesn't break (look at first few commits, went with a monofile approach lol), querying to a database and errors that occur (server can still take duplicate articles from api and save them, my db has 750 rows and most are from the same api pull). Learned about routes and how single page applications work. Learned a lot about state management in React.
Intend on rewriting this, very tired right now.

Tech used: Node, PostgreSQL, React, TailwindCSS.






in development

Snipr is a locally hosted RSS feed utilizing the News API. I intend on adding preferences and using scraping tools like Beautiful Soup to grab an entire article, and summarize it using LLMS (going to attempt to get accurate results). Articles are stored in a PostgreSQL database and the API will only pull once per day. As a consequence of the API, articles only are visible the day after their posting. Along with this, I hope to add persistence across a network, such that it is visible from any device connected to the host's network, but I'm taking this one thing at a time, and this is not my only project.

Light technical overview:
1. Create PG DB if not exist
2. Manually request todays articles. (Currently checks if there are articles in DB with matching date, if so, do not pull from API)'
3. Article titles and descriptions show up below.
4. Can like, dislike, or add to "read later". Selectable buttons on taskbar to see.

Goals:
1. Include full article + LLM summary as a menu expansion to article on page
2. Add persistence across the network.
3. Scan articles through a filter that knows my preferences, and delists articles based on whether I would like to see it (e.g. let's say I never wanted to see articles on the oura 'aura' 'oora' whatever ring, it could figure that out based on dislikes or if it was ever read)
4. Add search feature
5. Make it easily usable by those in as few steps and technical knowledge as possible.

Currently working on:
Refactoring front-end
Fixing DB saving stuff
Then all my goals :)

Hope to use this on a raspberry pi 4b I've had sitting around with nothing to do. I always have these big plans for SBCs but don't end up getting around to it because of all the other associated costs. Wanted one of the new jetson orin nano super but with the out-of-stock issues I haven't had the chance. Have some really cool plans for that thing once I shell out the money for it.


have to automate install of stuff or use docker (i think?)
api key goes in .env file within server/src
