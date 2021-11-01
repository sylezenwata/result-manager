const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const CONFIG = require("./config");

// exec express
const app = express();

// disable X-Powered-By
app.disable("x-powered-by");

// cookie
app.use(cookieParser());

// compression
const compress = (req, res) => {
	if (req.headers["x-no-compression"]) return false;
	return compression.filter(req, res);
};
app.use(compression({ filter: compress, threshold: 0 }));

// static routes
app.use(express.static(path.join(__dirname, "build")));

// app render
app.use((req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

// listening for port
let PORT = CONFIG.port;
app.listen(PORT, () =>
	console.log(`App runnig on port ${PORT}`)
);