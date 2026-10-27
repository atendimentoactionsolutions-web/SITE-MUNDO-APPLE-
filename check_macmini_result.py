import urllib.request, json

req = urllib.request.Request(
    'https://mundoappledelivery.com/api/products/live',
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req, timeout=10) as res:
    data = json.loads(res.read().decode('utf-8'))

products = data.get('products', [])
macmini = next((p for p in products if p.get('id') == 'mac-mini-m4-pro'), None)
if macmini:
    print('Mac mini M4 Pro priceFrom:', macmini.get('priceFrom'))
    for v in macmini.get('variants', []):
        print(f"  {v.get('chip')} - {v.get('storage')} - {v.get('ram')}: R$ {v.get('price')}")
