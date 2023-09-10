const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));

// Serve the login form when the user hits "/login"
app.get('/login', (req, res) => {
  res.send('<form action="/login" method="POST"><input type="text" name="user"><button type="submit">SignIn</button></form>');
});

// Handle the login form submission
app.post('/login', (req, res) => {
  const username = req.body.user;

  // Send a JavaScript script to the client to store the username in local storage and redirect
  const script = `
    <script>
      window.localStorage.setItem('username', '${username}');
      window.location.href = '/';
    </script>
  `;
  
  res.send(script);
});

// Serve the message form when the user hits "/"
app.get('/', (req, res) => {
  const username = req.query.username || 'Unknown'; // Get the username from the query string or use 'Unknown' if not provided
  res.send(`
    <p>Logged in as: ${username}</p>
    <form action="/" method="POST">
      <input type="text" name="message" placeholder="Enter your message" required>
      <button type="submit">Send</button>
    </form>
  `);
});

// Handle the message form submission
app.post('/', (req, res) => {
  const username = req.query.username || 'Unknown';
  const message = req.body.message;

  // Append the message to a file
  fs.appendFile('messages.txt', `"${username}": "${message}"\n`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing message.');
    }

    res.redirect(`/?username=${username}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
