import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)

stdin, stdout, stderr = ssh.exec_command('grep -rn "Loja" /var/www/ 2>/dev/null | grep -i undefined')
print(stdout.read().decode('utf-8', 'replace'))

ssh.close()
