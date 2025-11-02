import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

// Serve static assets exported by Vite build
app.use(express.static(path.join(currentDirPath, 'dist')));

// Always return index.html so client-side router can handle routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(currentDirPath, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
