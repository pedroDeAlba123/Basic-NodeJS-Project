const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");

const shopRoutes = require("./routes/shop");
const admitRoutes = require("./routes/admin");
const errorController = require("./controllers/error");

const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");

/*
const expressHbs = require('express-handlebars')
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout: 'main-layout'}));
app.set('view engine', 'hbs');

app.set('view engine', 'pug');
*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", admitRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Pedro", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
