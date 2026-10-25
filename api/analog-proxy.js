import https from 'node:https';

const ANALOG_HOST = '117.247.49.204';
const ANALOG_PREFIX = '/AppAnalogTagSVR';

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

function analogSuffix(req) {
  const pathParam = req.query?.path;
  if (Array.isArray(pathParam)) {
    return pathParam.filter(Boolean).join('/');
  }
  if (typeof pathParam === 'string' && pathParam.length > 0) {
    return pathParam.replace(/^\/+/, '');
  }

  const original =
    req.headers['x-forwarded-uri'] ||
    req.headers['x-invoke-path'] ||
    req.url ||
    '';
  const match = String(original).match(/\/api\/analog\/([^?]*)/);
  return match ? match[1].replace(/^\/+|\/+$/g, '') : '';
}

function analogSearch(req) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query ?? {})) {
    if (key === 'path') continue;
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, String(item));
    } else if (value != null) {
      query.set(key, String(value));
    }
  }
  return query.toString();
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const suffix = analogSuffix(req);
  const search = analogSearch(req);
  const path = `${ANALOG_PREFIX}/${suffix}${search ? `?${search}` : ''}`;

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
