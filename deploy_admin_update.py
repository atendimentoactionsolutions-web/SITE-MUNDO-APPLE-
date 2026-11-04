import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=30)

print("1. Rebuilding docker image on VPS with new code...")
stdin, stdout, stderr = ssh.exec_command('cd /opt/mundo-apple-site && docker compose build --no-cache && docker compose up -d')

for line in iter(stdout.readline, ""):
    print(line, end="")

err = stderr.read().decode('utf-8', 'replace')
if err:
    print("STDERR:\n", err)

print("2. Checking docker ps...")
stdin, stdout, stderr = ssh.exec_command('docker ps')
print(stdout.read().decode('utf-8', 'replace'))

ssh.close()
