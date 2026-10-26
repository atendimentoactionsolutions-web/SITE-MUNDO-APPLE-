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
duos = [i for i in items if 'DUO' in (i.get('name') or '').upper() or 'DUO' in (i.get('description') or '').upper()]
print(f'Items with DUO in supplier: {len(duos)}')
for d in duos[:10]:
    print(d)

iphones = set(i.get('name') for i in items if i.get('category') == 'IPH')
print('All iPhone names in supplier:', sorted(list(iphones)))
