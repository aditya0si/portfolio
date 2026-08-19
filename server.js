import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const portfolioDir = path.join(__dirname, 'portfolio');
const researchDir = path.join(__dirname, 'research');

app.use(express.static(portfolioDir));
app.use('/research', express.static(researchDir));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(portfolioDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
});
