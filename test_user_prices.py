import urllib.request, ssl, json

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
new_items = [i for i in items if not i.get('isSeminovo') and i.get('condition') != 'SEMINOVO' and i.get('category') != 'SEMI']

targets = [
    ('IPHONE 17 PRO', '256GB', 'COSMIC ORANGE'),
    ('IPHONE 17 PRO', '256GB', 'DEEP BLUE'),
    ('IPHONE 17 PRO', '256GB', 'SILVER'),
    ('IPHONE 17 PRO', '512GB', 'COSMIC ORANGE'),
    ('IPHONE 17 PRO', '512GB', 'SILVER'),
    ('IPHONE 17 PRO', '512GB', 'DEEP BLUE'),
]

for name, stg, col in targets:
    matches = [i.get('price') for i in new_items if i.get('name') == name and i.get('storage') == stg and i.get('color') == col and i.get('price')]
    min_p = min(matches) if matches else None
    print(f"{name} {stg} {col} -> Min: {min_p} (Total items: {len(matches)})")
