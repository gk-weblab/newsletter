const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");
const PORT = 3000;

mailchimp.setConfig({
  apiKey: "e914017a33523bc2380dc5c37dd15185-us21",
  server: "us21",
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.get("/failure", function (req, res) {
  res.sendFile(__dirname + "/failure.html");
});
app.get("/success", function (req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.post("/", function (req, res) {
  console.log(req.body.fullName, req.body.email);

  const listId = "d83daefe55";
  const subscriberHash = md5(req.body.email.toLowerCase());
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email,
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
      console.log(response);
      return res.redirect("/success");
    } catch (e) {
      console.log(e);
      return res.redirect("/failure");
    }

  }

  run();
});
app.listen(PORT, function () {
  console.log(`Server is running at PORT:${PORT}`);}
);



// Api key
// e914017a33523bc2380dc5c37dd15185-us21
