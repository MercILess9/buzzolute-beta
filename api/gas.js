const GAS_URL = 'https://script.google.com/macros/s/AKfycbxwtKrsb--jJ7shxfDOF_gugk1erpOINkR9D8yIMbr9snpcLJksaM61qKXC2RjDoEY1/exec';

export default async function handler(req, res) {
  const params = new URLSearchParams(req.query).toString();
  const url = `${GAS_URL}?${params}`;

  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        redirect: 'follow'
      });
      const data = await response.json();
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json(data);
    }

    const response = await fetch(url, { redirect: 'follow' });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);

  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ status: 'error', message: e.message });
  }
}
