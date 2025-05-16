import 'zone.js/node';

import express from 'express';
import { join } from 'path';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { APP_BASE_HREF } from '@angular/common';

// Import default pois seu main.server.ts exporta default
import AppServerModule from './src/main.server';

const app = express();

const distFolder = join(process.cwd(), 'dist/my-task-board/browser');
const indexHtml = 'index.html';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.set('view engine', 'html');
app.set('views', distFolder);

app.get('*.*', express.static(distFolder, {
  maxAge: '1y'
}));

app.get('*', (req, res) => {
  res.render(indexHtml, {
    req,
    providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
  });
});

const port = process.env['PORT'] || 4000;

app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
