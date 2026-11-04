import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=10)

stdin, stdout, stderr = ssh.exec_command('ls -la /var/www/mundo-apple-delivery/products_override.json')
print(stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command('cat /var/www/mundo-apple-delivery/products_override.json 2>/dev/null')
print('Override content:', stdout.read().decode())

ssh.close()
