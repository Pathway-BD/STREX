const https = require('https');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

exports.handler = async (event) => {
  const page = (event.queryStringParameters && event.queryStringParameters.page) || 'default';

  const apis = [
    `https://api.counterapi.dev/v1/pathway-strex-bd/${page}/up`,
    `https://api.countapi.xyz/hit/pathway-strex-bd/${page}`,
  ];

  for (const url of apis) {
    try {
      const raw = await httpGet(url);
      const json = JSON.parse(raw);
      const count = json.count != null ? json.count : json.value;
      if (count != null) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ count }),
        };
      }
    } catch (_) {}
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ count: null }),
  };
};
