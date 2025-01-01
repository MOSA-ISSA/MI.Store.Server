const http = require("http");
const app = require("./app");
const port = process.env.port || 2999; l
const server = http.createServer(app);

// app.listen(port);
// server.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

module.exports = server;
