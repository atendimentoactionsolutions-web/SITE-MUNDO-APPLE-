import paramiko
import sys

def check_docker():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)
    
    stdin, stdout, stderr = ssh.exec_command('ls -la /opt/mundo-apple-site; cat /opt/mundo-apple-site/docker-compose.yml 2>/dev/null || cat /opt/mundo-apple-site/docker-compose.yaml 2>/dev/null')
    out = stdout.read().decode('utf-8', 'replace')
    sys.stdout.buffer.write(out.encode('utf-8'))
    
    ssh.close()

if __name__ == '__main__':
    check_docker()
