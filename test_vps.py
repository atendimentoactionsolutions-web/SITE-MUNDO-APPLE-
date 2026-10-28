import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)

stdin, stdout, stderr = ssh.exec_command('git -C /var/www/mundoapple status')
print("STDOUT:", stdout.read().decode('utf-8', 'replace'))
print("STDERR:", stderr.read().decode('utf-8', 'replace'))

ssh.close()
