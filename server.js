import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import next from 'next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run from the Next app directory so Tailwind/postcss resolve their configs
// in dev mode too (production builds `cd portfolio && next build` anyway).
const PORTFOLIO_DIR = path.join(__dirname, 'portfolio');
process.chdir(PORTFOLIO_DIR);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: '.' });
const handle = nextApp.getRequestHandler();

const PORT = 3000;

nextApp.prepare().then(() => {
  const app = express();

  const researchDir = path.join(__dirname, 'research');
  app.use('/research', express.static(researchDir));

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
});
