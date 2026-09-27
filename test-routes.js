const http = require('http');

const routes = [
  '/',
  '/tourist',
  '/tourist/map',
  '/tourist/alerts',
  '/tourist/digital-id',
  '/tourist/offline',
  '/tourist/incident',
  '/tourist/profile',
  '/tourist/privacy',
  '/authority',
  '/authority/map',
  '/authority/incidents',
  '/authority/tourists',
  '/authority/response',
  '/authority/analytics',
  '/authority/crowd',
  '/authority/geofences',
  '/authority/verification',
  '/authority/insights',
  '/authority/data-intelligence',
  '/authority/audit',
  '/authority/architecture',
  '/architecture',
  '/privacy',
  '/demo'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + route, (res) => {
      console.log(`[HTTP ${res.statusCode}] ${route}`);
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.error(`[ERROR] ${route}: ${err.message}`);
      resolve(false);
    });
  });
}

async function runAll() {
  console.log('--- Testing All 25 Smart Tourist Safety Routes ---');
  let passed = 0;
  for (const r of routes) {
    const ok = await checkRoute(r);
    if (ok) passed++;
  }
  console.log(`--- Result: ${passed}/${routes.length} Routes Operational ---`);
  if (passed === routes.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAll();
