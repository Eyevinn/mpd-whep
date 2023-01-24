import fastify from 'fastify';
import cors from '@fastify/cors';
import {
  addWHEPAdaptionSet,
  buildManifest,
  parseManifest,
  updateBaseURL
} from './dash';
import { fetch } from 'undici';

const manifestUrl = process.argv[2];
const whepUrl = process.argv[3];
if (!manifestUrl || !whepUrl) {
  console.error('No MPD or WHEP provided');
  process.exit(1);
}

const server = fastify();
server.register(cors);

server.get('/manifest.mpd', async (request, reply) => {
  const xml = await (await fetch(manifestUrl)).text();

  const manifest = parseManifest(xml);
  updateBaseURL(manifest, manifestUrl);
  addWHEPAdaptionSet(manifest, whepUrl);

  return reply.send(buildManifest(manifest));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    throw err;
  }
  console.log(`WebRTC/DASH Manifest available at ${address}/manifest.mpd`);
});
