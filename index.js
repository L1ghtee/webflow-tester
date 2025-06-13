const express = require('express');
const runTest = require('./test/check-buttons');

const app = express();

app.get('/', async (req, res) => {
  try {
    await runTest();
    res.send('test run successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send(`❌ Test failed: ${err.message}`);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🟢 Server running on port ${port}`));
