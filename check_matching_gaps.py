import urllib.request, json, re

req = urllib.request.Request('https://srv2058756.hstgr.cloud/api/products', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.loads(r.read().decode('utf-8'))
items = [i for i in data.get('data', []) if not i.get('isSeminovo') and i.get('condition') != 'SEMINOVO' and i.get('category') != 'SEMI']

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

names = re.findall(r'"name":\s*"([^"]+)"', text)
conditions = re.findall(r'"condition":\s*"([^"]+)"', text)

new_names = [names[i] for i in range(min(len(names), len(conditions))) if conditions[i] == 'new']
print('Total new products in site catalog:', len(new_names))

def norm(s):
    return re.sub(r'[^A-Z0-9]', '', s.upper())

supplier_names = set(norm(i.get('name') or '') for i in items if i.get('name'))

missing = []
for n in new_names:
    n_clean = norm(n)
    matched = any(sn in n_clean or n_clean in sn for sn in supplier_names)
    if not matched:
        missing.append(n)

print('Site new products not matching any supplier name:', missing)
