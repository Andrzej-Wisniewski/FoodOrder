import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const openApiPath = path.join(__dirname, '../../docs/openapi.yaml');
const swaggerDocs = parse(readFileSync(openApiPath, 'utf8'));

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
