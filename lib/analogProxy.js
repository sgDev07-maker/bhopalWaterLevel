import https from 'node:https';

const ANALOG_HOST = '117.247.49.204';
const ANALOG_PREFIX = '/AppAnalogTagSVR';

export function forwardAnalog(req, res, suffix) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query ?? {})) {
    if (key === 'path') continue;
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, String(item));
    } else if (value != null) {
      query.set(key, String(value));
    }
  }

  const cleanSuffix = String(suffix).replace(/^\/+/, '');
  const search = query.toString();
  const path = `${ANALOG_PREFIX}/${cleanSuffix}${search ? `?${search}` : ''}`;

  const request = https.request(
    {
      hostname: ANALOG_HOST,
      path,
      method: 'GET',
      timeout: 20_000,
      // Legacy analog server may present an untrusted certificate.
      // Server-side only. Never disable TLS in the browser.
      rejectUnauthorized: false,
      headers: {
        Accept: 'application/json',
      },
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
