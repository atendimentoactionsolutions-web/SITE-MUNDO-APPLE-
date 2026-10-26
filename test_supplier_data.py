import urllib.request, ssl, json
from collections import defaultdict

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    'https://srv2058756.hstgr.cloud/api/products',
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
    res = json.loads(resp.read().decode('utf-8'))

items = res.get('data', [])
# Filter out seminovos
new_items = [i for i in items if not i.get('isSeminovo') and i.get('condition') != 'SEMINOVO' and i.get('category') != 'SEMI']

print(f'Total new items from supplier: {len(new_items)}')

# Group by category and inspect distinct names
by_cat = defaultdict(set)
for i in new_items:
    by_cat[i.get('category')].add(i.get('name'))

for cat, names in by_cat.items():
    print(f'Category {cat} ({len(names)} models): {sorted(list(names))[:8]}')

# Sample iPhone items
iphs = [i for i in new_items if i.get('name') == 'IPHONE 17 PRO']
print(f'\nSample IPHONE 17 PRO items ({len(iphs)}):')
for ip in iphs[:6]:
    print(f"  Storage: {ip.get('storage')}, Color: {ip.get('color')}, Price: {ip.get('price')}, Description: {ip.get('description')}")
