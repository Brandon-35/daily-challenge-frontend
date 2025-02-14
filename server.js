const express = require('express');
const path = require('path');
const cors = require('cors');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Spawn SCSS compiler
const scssCompiler = spawn('sass', ['--watch', 'assets/scss:assets/css']);

// Log SCSS compiler output
scssCompiler.stdout.on('data', (data) => {
  console.log(`SCSS Compiler: ${data}`);
});

scssCompiler.stderr.on('data', (data) => {
  console.error(`SCSS Compiler Error: ${data}`);
});

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

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping SCSS compiler and server...');
  scssCompiler.kill();
  server.close();
  process.exit();
});