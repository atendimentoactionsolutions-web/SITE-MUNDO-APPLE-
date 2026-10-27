import sys, paramiko
sys.stdout.reconfigure(encoding='utf-8')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)

stdin, stdout, stderr = ssh.exec_command('cat /usr/local/bin/deploy-site')
print('=== /usr/local/bin/deploy-site ===')
print(stdout.read().decode('utf-8', 'replace'))

stdin, stdout, stderr = ssh.exec_command('pm2 describe 1')
print('=== pm2 describe 1 ===')
print(stdout.read().decode('utf-8', 'replace'))

ssh.close()
