var http = require("http");
console.log("hello world");
http.createServer(function (req, res) {
    res.write("Hello world");
    res.end();
}).listen(8002);
