import paramiko
import sys
import time

def run():
    print("Connecting to VPS 179.236.75.100...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)
    print("Connected! Triggering deploy...")
    
    # Run deploy script
    stdin, stdout, stderr = ssh.exec_command('/usr/local/bin/deploy-site')
    
    # Stream output
    for line in iter(stdout.readline, ""):
        print(line, end="")
    for line in iter(stderr.readline, ""):
        print("STDERR:", line, end="")
        
    exit_status = stdout.channel.recv_exit_status()
    print(f"\nDeploy exited with status code: {exit_status}")
    
    # Check pm2 status
    stdin, stdout, stderr = ssh.exec_command('pm2 status mundo-apple-site')
    print("PM2 Status:")
    print(stdout.read().decode('utf-8', 'replace'))
    
    ssh.close()

if __name__ == '__main__':
    run()
