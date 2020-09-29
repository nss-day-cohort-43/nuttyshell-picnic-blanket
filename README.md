# Nutshell: The Information Dashboard
Nutshell is a dashboard for people to organize their daily tasks, events, news articles, friends, and chat messages.
All of the items listed above can be added, deleted, and edited as the user likes.
Users can also use this site to connect with new people via the public chat feature.
This dashboard was created by Ben Davis, Brady Logan, Morrigan McCoy, and Travis Pinson.

## Technologies & Skills Used:
HTML, CSS/Flexbox, JavaScript, functions, databases, Github, objects, array methods, components, handling user events, implementing CRUD operations, relational data, ERDs.

## Setup: Follow these steps exactly

1. Clone this repository
2. `cd` into the directory it creates
3. Make a `database.json` file in the `api` directory
4. Delete the `.ignore` file in the `api` directory
5. Edit the `database.json` file to have the following:
`{
  "users": [],
  "events": [],
  "tasks": [],
  "articles":[],
  "friends":[],
  "messages": []
}`
6. Create a `Settings.js` file in the `src` directory.
7. Input the following into `Settings.js`:
export default {
    weatherKey: ""
}
8. Obtain a weather api key from https://openweathermap.org/api
9. Copy and paste your api key into the the `""` in `Settings.js`
10. Run json-server in your terminal by navigating to the `api` directory, and typing the following:
`json-server -p 8088 -w database.json`
11. Serve the application by navigating in a separate window to the `src` directory and entering `serve`.


## A Note About Authentication

We want you to know that the login and registration code is fake, completely insecure, and would never be implemented in a professional application. It is a simulation authentication using very simplistic tools, because authentication is not a learning objective of students at NSS.
