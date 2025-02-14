const express = require('express');
const path = require('path');
const cors = require('cors');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();
const PORT = process.env.PORT || 3000;

// Create a live reload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname));

// Ping browser on Express boot, once browser reload
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Inject live reload script into HTML
app.use(connectLivereload());

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});