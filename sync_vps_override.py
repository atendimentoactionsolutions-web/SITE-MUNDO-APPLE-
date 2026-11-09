import paramiko
import sys
import requests

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=30)

print("1. Uploading updated products_override.json to VPS volume...")
sftp = ssh.open_sftp()
sftp.put('products_override.json', '/var/lib/docker/volumes/mundo-apple-site_app-data/_data/products_override.json')
sftp.close()
print("Uploaded successfully!")

# Also update the git repository on the VPS so that any future build has it
print("2. Updating git repo on VPS...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/mundo-apple-delivery && git fetch origin main && git reset --hard origin/main 2>/dev/null || true')
print(stdout.read().decode('utf-8', 'replace'))

ssh.close()

print("3. Testing public site https://mundoappledelivery.com/produtos/macbook-air-m4 ...")
try:
    r = requests.get('https://mundoappledelivery.com/produtos/macbook-air-m4', timeout=10)
    print("Status code for macbook-air-m4:", r.status_code)
except Exception as e:
    print("Error testing:", e)
