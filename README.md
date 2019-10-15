# Login Application - CMPE 172
## How to Run the Application
1. Download/clone the source files from the github repo
2. Navigate into the source files folder and run npm install
3. To launch development mode run 'npm run dev', to launch outside of development mode run 'npm start'
4. MongoDB connection should be created and show up in console
5. To interact with application, go to your internet browser and navigate to 'localhost:5000'
## Dependencies/tools Used and Reasons Why
1. Express: Express.JS is a web application framework for Node.js that is designed for building web apps.
2. bcryptjs: Bcryptjs is being used to encrypt passwords, adding a level of security to protect our users private information.
3. Passport.js: Passport.js is used for authentication, however other installations must be made along with it depending on what forms of login authentication is needed.
4. Passport-local: This dependancy is solely for our local strategy for authentication (using emails instead of oAuth).
5. EJS: EJS is the template engine that we're using
6. Express-EJS-Layouts: This dependency is used for layouts for EJS as for some reason, EJS doesn't have layouts by default.
7. Mongoose: Mongoose is used to deal/interact with MongoDB.
8. Connect-Flash: Connect flash is used for flash messaging.
9. Express-Session: Used to communicate data to middleware that is executed later or to retrieve data later on.
10. Nodemon: This dependency is used for development. Allows us to not have to restart server ourselves everytime we make a change, it constantly watches for changes and restarts automatically when we save changes.
11. Font Awesome (CDN): Used for icons.
12. Bootstrap/Bootswatch (CDN): Used for a quick front end/UI.
