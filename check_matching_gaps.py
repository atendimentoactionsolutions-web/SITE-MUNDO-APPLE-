import urllib.request, json
from collections import defaultdict

req = urllib.request.Request('https://srv2058756.hstgr.cloud/api/products', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.loads(r.read().decode('utf-8'))

items = [i for i in data.get('data', []) if not i.get('isSeminovo') and i.get('condition') != 'SEMINOVO' and i.get('category') != 'SEMI']

# Check our base products
from src_products import products

not_matched = []
for p in products:
    if p.get('condition') != 'new': continue
    p_name = p.get('name')
    # Check if any supplier item matches
    found = any(i for i in items if p_name.upper() in (i.get('name') or '').upper() or (i.get('name') or '').upper() in p_name.upper())
    if not found:
        not_matched.append(p_name)

print('Base products without direct name match in supplier:', not_matched)
