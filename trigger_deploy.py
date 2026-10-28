import sys
import paramiko

print("Conectando ao VPS 179.236.75.100 para deploy...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)

print("Executando deploy...")
stdin, stdout, stderr = ssh.exec_command('/usr/local/bin/deploy-site')

# Stream stdout
for line in iter(stdout.readline, ""):
    print(line, end="")

error_output = stderr.read().decode('utf-8', 'replace')
if error_output:
    print("STDERR:", error_output)

print("Deploy finalizado.")
ssh.close()
