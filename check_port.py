import paramiko
import sys

def check_port():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)
    
    stdin, stdout, stderr = ssh.exec_command('lsof -i :3000 || fuser 3000/tcp || netstat -tlpn | grep 3000 || ss -tlpn | grep 3000')
    out = stdout.read().decode('utf-8', 'replace')
    sys.stdout.buffer.write(out.encode('utf-8'))
    
    ssh.close()

if __name__ == '__main__':
    check_port()
