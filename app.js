const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index.ejs");
});

app.use("*", (req, res) => {
	res.redirect("/");
});

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Listening on " + port);
	}
});
