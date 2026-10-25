import https from 'node:https';

const ANALOG_HOST = '117.247.49.204';
const ANALOG_PREFIX = '/AppAnalogTagSVR';

export const config = {
  maxDuration: 30,
};

function analogPath(req) {
  const pathParam = req.query.path;
  const suffix = Array.isArray(pathParam)
    ? pathParam.join('/')
    : typeof pathParam === 'string'
      ? pathParam
      : '';

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query ?? {})) {
    if (key === 'path') continue;
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, String(item));
    } else if (value != null) {
      query.set(key, String(value));
    }
  }

  const search = query.toString();
  return `${ANALOG_PREFIX}/${suffix}${search ? `?${search}` : ''}`;
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const request = https.request(
    {
      hostname: ANALOG_HOST,
      path: analogPath(req),
      method: 'GET',
      timeout: 20_000,
      // Legacy analog server may present an untrusted certificate.
      // This is server-side only. Do not disable TLS in the browser.
      rejectUnauthorized: false,
    },
    (upstream) => {
      const chunks = [];
      upstream.on('data', (chunk) => chunks.push(chunk));
      upstream.on('end', () => {
        res.status(upstream.statusCode || 502);
        res.setHeader(
          'Content-Type',
          upstream.headers['content-type'] || 'application/json',
        );
        res.send(Buffer.concat(chunks));
      });
    },
  );

  request.on('timeout', () => {
    request.destroy();
    if (!res.headersSent) {
      res.status(504).json({ message: 'Analog API timed out' });
    }
  });

  request.on('error', () => {
    if (!res.headersSent) {
      res.status(502).json({ message: 'Analog API request failed' });
    }
  });

  request.end();
}
