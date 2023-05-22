const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));

// Endpoint 1: Returns a 404 error after a 2-second delay
app.get('/error', (req, res) => {
  setTimeout(() => {
    res.status(404).send('Error 404: Page not found');
  }, 2000);
});

// Endpoint 2: Returns a JSON response after a x-second delay
app.get('/data/:x', (req, res) => {
  setTimeout(() => {
    const jsonData = { message: `You passed ${req.params.x} ms` };
    res.json(jsonData);
  }, Number(req.params.x));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
