const fs = require("fs");

const requestHandler = (req, res) => {
  // console.log(req.url, req.method, req.headers);
  // process.exit();
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302; // code for redirect
        res.setHeader("Location", "/"); // redirect to the root "/"
        // res.writeHead(302, { "Location": "/" }); This is another way to redirect
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end();
};

// module.exports = requestHandler;

// module.exports = {
//   handler: requestHandler,
//   someText: "Server started and running!",
// };

// module.exports.handler = requestHandler;
// module.exports.someText = "Server started and running!";

// you can also do it like this:
exports.handler = requestHandler;
exports.someText = "Server started and running!";
