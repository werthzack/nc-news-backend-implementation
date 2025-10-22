const app = require("./app.js");

const PORT = 4090;

app.listen(PORT, (err) => {
  if (err) {
    console.log("The server has encountered an error: \n", err);
  } else {
    console.log("Server active: Listening on port", PORT);
  }
});
