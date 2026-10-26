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

iph_17_pro = [i for i in new_items if i.get('name') == 'IPHONE 17 PRO' and i.get('storage') == '256GB' and i.get('color') == 'COSMIC ORANGE']
prices = [i.get('price') for i in iph_17_pro if i.get('price') and i.get('price') > 0]
print(f'IPHONE 17 PRO 256GB COSMIC ORANGE count: {len(iph_17_pro)}')
print(f'Min price: {min(prices) if prices else None}')
print(f'All prices: {sorted(prices)}')
