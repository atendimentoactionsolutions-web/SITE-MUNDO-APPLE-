import paramiko
import json

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)

script = """
const path = require('path');
process.chdir('/var/www/mundo-apple-delivery');

// We can run a small script inside the Next.js production build or ts-node/tsx if available,
// or inspect products directly via a quick node runner.
const fs = require('fs');
let overrides = {};
try {
  overrides = JSON.parse(fs.readFileSync('products_override.json', 'utf8'));
} catch (e) {}

// Let's check initial products
console.log('Overrides keys count:', Object.keys(overrides).length);
"""

stdin, stdout, stderr = ssh.exec_command(f'node -e "{script}"')
print(stdout.read().decode())

ssh.close()
