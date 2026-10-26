import urllib.request, json

req = urllib.request.Request(
    'https://mundoappledelivery.com/api/products/live',
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req, timeout=10) as res:
    data = json.loads(res.read().decode('utf-8'))

products = data.get('products', [])
duo = next((p for p in products if p.get('id') == 'iphone-duo'), None)
if duo:
    print('iPhone Duo priceFrom:', duo.get('priceFrom'))
    print('Availability:', duo.get('availability'))
    print('Variants:')
    for v in duo.get('variants', []):
        print(f"  {v.get('storage')} - {v.get('color')}: R$ {v.get('price')}")
