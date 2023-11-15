const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Homepage</title></head>");
    res.write("<body>");
    res.write("<h1>Hello! Welcome to MY PAGE!</h1>");
    res.write(
      "<form action='/create-user' method='POST'><label>Username: </label><input type='text' name='username'><button type='submit'>Submit</button></form>"
    );
    res.write("<a href='/users'><button>User List</button></a>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }
  if (url === "/create-user" && method === "POST") {
    const userData = [];
    req.on("data", (chunk) => {
      userData.push(chunk);
    });
    return req.on("end", () => {
      const parsedUserData = Buffer.concat(userData).toString();
      const username = parsedUserData.split("=")[1];
      fs.writeFile("username.txt", username, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/users");
        return res.end();
      });
    });
  }
  if (url === "/users" && method === "GET") {
    return fs.readFile("username.txt", "utf8", (err, data) => {
      res.setHeader("Content-Type", "text/html");
      res.write("<html>");
      res.write("<head><title>User List</title></head>");
      res.write(
        `<body><ul><li>${data}</li></ul><a href='./'><button>Homepage</button></a></body>`
      );
      res.write("</html>");
      return res.end();
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Page not found</title><head>");
  res.write("<body><h1>PAGE NOT FOUND</h1></body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
