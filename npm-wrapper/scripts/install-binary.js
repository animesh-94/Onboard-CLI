const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO = 'animesh-94/Onboard-CLI';
const BIN_DIR = path.join(__dirname, '..', 'bin');
const BIN_NAME = process.platform === 'win32' ? 'onboard.exe' : 'onboard';
const BIN_PATH = path.join(BIN_DIR, BIN_NAME);

// Map Node.js platform/arch to our Go release artifacts
const platformMap = {
  win32: 'windows',
  darwin: 'darwin',
  linux: 'linux',
};

const archMap = {
  x64: 'amd64',
  arm64: 'arm64',
};

const platform = platformMap[process.platform];
const arch = archMap[process.arch];

if (!platform || !arch) {
  console.error(`Unsupported platform or architecture: ${process.platform} ${process.arch}`);
  process.exit(1);
}

const artifactName = `onboard-${platform}-${arch}${process.platform === 'win32' ? '.exe' : ''}`;

async function fetchLatestRelease() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/releases/latest`,
      headers: {
        'User-Agent': 'Onboard-CLI-NPM-Wrapper',
      },
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to fetch release info: ${res.statusCode} ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    // Handle redirects
    const request = (downloadUrl) => {
      https.get(downloadUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return request(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download binary: ${res.statusCode}`));
        }
        
        res.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    };
    
    request(url);
  });
}

async function install() {
  try {
    console.log('Fetching latest release information...');
    const release = await fetchLatestRelease();
    
    const asset = release.assets.find(a => a.name === artifactName);
    if (!asset) {
      throw new Error(`Could not find artifact ${artifactName} in latest release (${release.tag_name})`);
    }

    if (!fs.existsSync(BIN_DIR)) {
      fs.mkdirSync(BIN_DIR, { recursive: true });
    }

    console.log(`Downloading ${artifactName} from ${asset.browser_download_url}...`);
    await downloadBinary(asset.browser_download_url, BIN_PATH);

    // Make the binary executable on non-Windows platforms
    if (process.platform !== 'win32') {
      fs.chmodSync(BIN_PATH, 0o755);
    }

    console.log(`Successfully installed onboard binary to ${BIN_PATH}`);
  } catch (err) {
    console.error('Installation failed:', err.message);
    process.exit(1);
  }
}

install();
