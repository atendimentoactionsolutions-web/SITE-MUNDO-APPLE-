import sys
import paramiko

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=30)

print("Iniciando build na VPS...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/mundo-apple-delivery && npm run build')

out = stdout.read().decode('utf-8', 'replace')
err = stderr.read().decode('utf-8', 'replace')

print("STDOUT:\n", out)
print("STDERR:\n", err)

print("Recarregando PM2...")
stdin, stdout, stderr = ssh.exec_command('pm2 reload mundo-apple-site')
print(stdout.read().decode('utf-8', 'replace'))

ssh.close()
