import { forwardAnalog } from '../../../lib/analogProxy.js';

export const config = {
  maxDuration: 30,
};

export default function handler(req, res) {
  forwardAnalog(req, res, '/tagapi/gettagsbyid/');
}
