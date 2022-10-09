const madge = require("madge");

madge("dist/app.js")
	.then((res) => res.image("graph.svg"))
	.then((writtenImagePath) => {
		console.log("Image written to " + writtenImagePath);
	});