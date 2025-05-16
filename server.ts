import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine'; // Correto para SSR com Angular Universal
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server'; // Ajuste para importar o bootstrap
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'; // Para carregamento do módulo

// Express app
const server = express();
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

// Configuração do Express Engine para Angular Universal
server.engine('html', ngExpressEngine({
  bootstrap // Utilizando o bootstrap direto do arquivo main.server.ts
}));

server.set('view engine', 'html');
server.set('views', browserDistFolder);

// Serve arquivos estáticos da pasta /browser
server.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  })
);

// Todas as rotas regulares usam o motor do Angular
server.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  res.render('index', {
    req,
    res,
    providers: [
      { provide: APP_BASE_HREF, useValue: baseUrl }
    ],
    documentFilePath: indexHtml,
    url: `${protocol}://${headers.host}${originalUrl}`,
    publicPath: browserDistFolder
  });
});

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Inicia o servidor Node
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
