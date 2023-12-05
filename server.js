if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Importing Libraies that we installed using npm
const express = require("express");
const app = express();
const bcrypt = require("bcrypt"); // Importing bcrypt package
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path"); // Import the path module
const ejs = require("ejs");

const databaseFunctions = require("./databaseUtils");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

initializePassport(
  passport,
  (username) => users.find((user) => user.username === username),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Configuring the register post functionality
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// verify user credentials at login
passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // Make sure this matches the 'name' attribute in your form
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await databaseFunctions.getUserByUsername(username);

        if (!user) {
          return done(null, false, { message: "No user with that username" });
        }

        const passwordMatch = await bcrypt.compare(password, user.pword);

        if (passwordMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword,
    });

    await databaseFunctions.createRecord(
      users[users.length - 1].username,
      users[users.length - 1].password
    );
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/register");
  }
});

// Routes
app.get("/", checkAuthenticated, async (req, res) => {
  try {
    const user = await req.user;
    const returnQuery = await databaseFunctions.getHealthRecords();
    // Render the page with the combined data
    res.render("index.ejs", { username: user.uname, records: returnQuery });
  } catch (error) {
    console.error(error);
    // Handle the error, perhaps redirect to an error page
    res.status(500).send("Internal Server Error");
  }
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});
// End Routes

app.delete("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/login");
  });
});

app.delete("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3007);
