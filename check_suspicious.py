import urllib.request, json, re

req = urllib.request.Request('https://srv2058756.hstgr.cloud/api/products', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.loads(r.read().decode('utf-8'))
items = [i for i in data.get('data', []) if not i.get('isSeminovo') and i.get('condition') != 'SEMINOVO' and i.get('category') != 'SEMI']

targets = ['IPHONE 13', 'IPAD AIR M4', 'MAGIC KEYBOARD', 'APPLE WATCH SE']
for t in targets:
    print(f"\n=== Supplier items matching '{t}' ===")
    matches = [i for i in items if t in (i.get('name') or '').upper()]
    for m in matches[:6]:
        print(f"Name: {m.get('name')} | Stg: {m.get('storage')} | Color: {m.get('color')} | Price: {m.get('price')} | Desc: {m.get('description')}")
