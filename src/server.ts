import fastify from 'fastify';
import cors from '@fastify/cors';
import {
  addWHEPAdaptionSet,
  buildManifest,
  parseManifest,
  updateBaseURL
} from './dash';
import { fetch } from 'undici';

function log(...args: any) {
  console.log(`[Server]`, ...args);
}

const manifestUrl = process.argv[2];
const whepUrl = process.argv[3];
if (!manifestUrl || !whepUrl) {
  console.error('No MPD or WHEP provided');
  process.exit(1);
}

const server = fastify();
server.register(cors);

server.get('/manifest.mpd', async (request, reply) => {
  const manifestText = await (await fetch(manifestUrl)).text();

  const manifest = parseManifest(manifestText);
  updateBaseURL(manifest, manifestUrl);
  addWHEPAdaptionSet(manifest, whepUrl);
  const xml = buildManifest(manifest);
  if (!xml) {
    return reply.code(500).send('Failed to build manifest');
  }
  return reply.send(xml);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    throw err;
  }
  log(`WebRTC/DASH Manifest available at ${address}/manifest.mpd`);
});
