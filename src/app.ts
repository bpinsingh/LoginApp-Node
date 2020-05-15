import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI } from "./util/secrets";

// Controllers (route handlers)

import { UserController } from "./controllers/user";
import { ValidateRequests } from "./middlewares/ValidateRequests";


// API keys and Passport configuration
// import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 6000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Set headers for Cross origin
app.all("/*", function(req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Access-Token,X-Key");

    if (req.method == "OPTIONS") {
        res.status(200).end();
    } else {
        next();
    }
});

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
const userController = new UserController();
const validateRequest = new ValidateRequests();
app.use("/api/*", validateRequest.validate);
app.get("/api/getUser/:userEmail", userController.getUser );
app.post("/postUser", userController.postUser );
app.post("/login", userController.login );

export default app;
