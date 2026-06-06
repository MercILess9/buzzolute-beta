const https = require('https');

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxwtKrsb--jJ7shxfDOF_gugk1erpOINkR9D8yIMbr9snpcLJksaM61qKXC2RjDoEY1/exec';

function fetchGAS(url) {
  return new Promise((resolve, reject) => {
    const request = (reqUrl) => {
      https.get(reqUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location);
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
        });
      }).on('error', reject);
    };
    request(url);
  });
}

module.exports = async function handler(req, res) {
  const params = new URLSearchParams(req.query).toString();
  const url = `${GAS_URL}?${params}`;

  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const params = new URLSearchParams(req.query).toString();
    const data = await fetchGAS(`${GAS_URL}?${params}`);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ status: 'error', message: e.message });
  }
}
