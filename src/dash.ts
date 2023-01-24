import {
  X2jOptions,
  XMLBuilder,
  XmlBuilderOptions,
  XMLParser
} from 'fast-xml-parser';

const options: Partial<X2jOptions & XmlBuilderOptions> = {
  ignoreAttributes: false,
  preserveOrder: true,
  format: true
};
const parser = new XMLParser(options);
const builder = new XMLBuilder(options);

export function parseManifest(manifest: string): any[] {
  return parser.parse(manifest);
}

export function buildManifest(manifest: any[]): string {
  return builder.build(manifest);
}

export function updateBaseURL(manifest: any[], manifestUrl: string) {
  const baseUrl = manifestUrl.replace(/\/[^/]*$/, '/');

  const mpdEl = manifest.find((el: any) => !!el.MPD);
  const baseUrlEl = mpdEl.MPD.find((el: any) => !!el.BaseURL);

  if (baseUrlEl) {
    // if baseUrl is an absolut url do nothing but if it's a relative path then replace it with baseUrl + the relative path
    if (baseUrlEl.BaseURL[0]?.["#text"]?.startsWith('http')) {
      return;
    }

    baseUrlEl.BaseURL[0]["#text"] = new URL(baseUrlEl.BaseURL[0]["#text"], baseUrl).toString();
  } else {
    mpdEl.MPD.unshift({
      BaseURL: [{
        "#text": baseUrl
      }]
    });
  }
}

// insert an adaptionset with a representation for the whep stream into the provided xmlstring
export function addWHEPAdaptionSet(manifest: any[], whep: string) {
  const mpdEl = manifest.find((el: any) => !!el.MPD);
  const periodEl = mpdEl.MPD.find((el: any) => !!el.Period);

  periodEl.Period.push({
    AdaptationSet: [
      {
        Representation: [],
        ':@': {
          '@_id': 'video',
          '@_mimeType': 'video RTP/AVP',
          '@_bandwidth': '250000',
          '@_width': '1280',
          '@_height': '720',
          '@_frameRate': '24/1',
          '@_codecs': 'avc1.4D401F'
        }
      }
    ],
    ':@': {
      '@_id': 'WHEP',
      '@_contentType': 'video',
      '@_mimeType': 'video RTP/AVP',
      '@_codecs': 'avc1.4D401F',
      '@_initializationPrincipal': whep
    }
  });
}
