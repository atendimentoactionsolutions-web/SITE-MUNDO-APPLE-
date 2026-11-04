import paramiko
import sys
import time

def run():
    print("Connecting to VPS 179.236.75.100...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)
    print("Connected! Checking status and waiting if build still running...")
    
    # Check if npm run build is running on server
    stdin, stdout, stderr = ssh.exec_command('ps aux | grep -E "next build|deploy-site"')
    print("Process check:")
    print(stdout.read().decode('utf-8', 'replace'))
    
    # Let's run deploy-site cleanly
    stdin, stdout, stderr = ssh.exec_command('/usr/local/bin/deploy-site')
    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')
    print("DEPLOY STDOUT:\n" + out)
    if err:
        print("DEPLOY STDERR:\n" + err)
        
    stdin, stdout, stderr = ssh.exec_command('pm2 status mundo-apple-site')
    print("PM2 STATUS:\n" + stdout.read().decode('utf-8', 'replace'))
    
    ssh.close()

if __name__ == '__main__':
    run()
