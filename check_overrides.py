import sys, paramiko, json
sys.stdout.reconfigure(encoding='utf-8')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('179.236.75.100', port=22, username='root', password='@Vaidatudocerto2026', timeout=15)

stdin, stdout, stderr = ssh.exec_command('cat /var/www/mundo-apple-delivery/products_override.json')
raw = stdout.read().decode('utf-8', 'replace')
try:
    d = json.loads(raw)
    print(f'Total products in override: {len(d)}')
    # Sample items
    for pid in list(d.keys())[:5]:
        item = d[pid]
        print(f"ID: {pid}, priceFrom: {item.get('priceFrom')}, variants: {len(item.get('variants', []))}")
        if item.get('variants'):
            for v in item['variants'][:3]:
                print(f"   {v.get('storage')} - {v.get('color')}: R$ {v.get('price')}")
except Exception as e:
    print('JSON error:', e)

ssh.close()
