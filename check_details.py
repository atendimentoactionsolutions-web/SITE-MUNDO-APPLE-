import urllib.request, json, re

req = urllib.request.Request('https://srv2058756.hstgr.cloud/api/products', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.loads(r.read().decode('utf-8'))
items = [i for i in data.get('data', []) if not i.get('isSeminovo') and i.get('condition') != 'SEMINOVO' and i.get('category') != 'SEMI']

def norm(s):
    return re.sub(r'[^A-Z0-9]', '', (s or '').upper())

iph13 = [i for i in items if "IPHONE13" in norm(i.get('name') or '')]
print(f"Total IPHONE 13 items in supplier: {len(iph13)}")
for ip in iph13:
    print(ip)

se_items = [i for i in items if "WATCHSE" in norm(i.get('name') or '') or "SE3" in norm(i.get('name') or '') or "SE2" in norm(i.get('name') or '')]
print(f"\nTotal Watch SE items in supplier: {len(se_items)}")
for se in se_items:
    print(f"Name: {se.get('name')} | Stg: {se.get('storage')} | Price: {se.get('price')} | Color: {se.get('color')}")
