import { forwardAnalog } from '../lib/analogProxy.js';

export const config = {
  maxDuration: 30,
};

export default function handler(req, res) {
  const pathParam = req.query?.path;
  const suffix = Array.isArray(pathParam)
    ? pathParam.filter(Boolean).join('/')
    : typeof pathParam === 'string'
      ? pathParam
      : 'tagapi/gettagsbyid/';
  forwardAnalog(req, res, suffix);
}
