import urllib.request, json
from collections import defaultdict

req = urllib.request.Request('https://srv2058756.hstgr.cloud/api/products', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.loads(r.read().decode('utf-8'))

items = [i for i in data.get('data', []) if not i.get('isSeminovo') and i.get('condition') != 'SEMINOVO' and i.get('category') != 'SEMI']

# Let's inspect unique names and see which products might fail matching
supplier_models = sorted(list(set(i.get('name') for i in items if i.get('name'))))
print(f'Total unique new model names in supplier: {len(supplier_models)}')
for sm in supplier_models:
    cat = next((i.get('category') for i in items if i.get('name') == sm), '')
    count = len([i for i in items if i.get('name') == sm])
    print(f"[{cat}] {sm} ({count} items)")
