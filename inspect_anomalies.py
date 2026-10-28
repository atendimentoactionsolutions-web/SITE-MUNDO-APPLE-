import urllib.request, json

req = urllib.request.Request(
    'https://mundoappledelivery.com/api/products/live',
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req, timeout=10) as res:
    data = json.loads(res.read().decode('utf-8'))

products = data.get('products', [])
for p in products:
    name = p.get('name')
    priceFrom = p.get('priceFrom')
    cat = p.get('category')
    variants = p.get('variants', [])
    v_prices = [f"{v.get('storage', '')} {v.get('color', '')}: {v.get('price')}" for v in variants[:4]]
    print(f"[{cat}] {name} -> R$ {priceFrom} | Vars: {', '.join(v_prices)}")
