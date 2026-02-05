# Designer Webapp

Full-stack web app for posting design tasks and requesting them with sample work.

## Setup

1. Copy the server environment file:
   - `server/.env.example` to `server/.env`
2. Install dependencies:
   - `npm install`
   - `npm --prefix server install`
   - `npm --prefix client install`
3. Run dev:
   - `npm run dev`

## Notes

- Replace AdSense publisher ID in `client/index.html`.
- Uploads are stored in `server/uploads`.
