import sys
import paramiko

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)

stdin, stdout, stderr = ssh.exec_command('pm2 logs mundo-apple-site --lines 30 --nostream')
print(stdout.read().decode('utf-8', 'replace'))

ssh.close()
