# MPD WHEP
Minimal proxy server to combine a MPEG-DASH Manifest with a WebRTC WHEP URL

## Usage

`npm start <MPD-URL> <WHEP-URL>`

### Docker

1) Build the image: `docker build . -t mpd-whep`
2) Run the image: `docker run -e MPD=<MPD-URL> -e WHEP=<WHEP-URL> -p 8000:8000 -d mpd-whep`
3) The manifest is now available at `http://localhost:8000/manifest.mpd`