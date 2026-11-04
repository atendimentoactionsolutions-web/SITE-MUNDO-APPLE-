import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=30)

print("Starting containers cleanly...")
stdin, stdout, stderr = ssh.exec_command('cd /opt/mundo-apple-site && docker compose up -d')
print(stdout.read().decode('utf-8', 'replace'))
print(stderr.read().decode('utf-8', 'replace'))

stdin, stdout, stderr = ssh.exec_command('docker ps')
print("DOCKER PS:\n", stdout.read().decode('utf-8', 'replace'))

ssh.close()
