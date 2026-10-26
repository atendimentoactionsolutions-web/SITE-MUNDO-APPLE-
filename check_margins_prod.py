import urllib.request, json

req = urllib.request.Request(
    'https://mundoappledelivery.com/api/products/live',
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req, timeout=10) as res:
    data = json.loads(res.read().decode('utf-8'))

products = data.get('products', [])

# 1. iPhone 17 Pro (Supplier was 7500 -> Expect 7800 with +300)
iph17pro = next((p for p in products if p.get('id') == 'iphone-17-pro'), None)
if iph17pro:
    print('iPhone 17 Pro priceFrom:', iph17pro.get('priceFrom'))
    for v in iph17pro.get('variants', []):
        print(f"  {v.get('storage')} - {v.get('color')}: R$ {v.get('price')}")

# 2. AirPods (Supplier was ~850 -> Expect ~1000 with +150)
airpods = next((p for p in products if p.get('category') == 'airpods'), None)
if airpods:
    print('\nAirPods sample priceFrom:', airpods.get('name'), airpods.get('priceFrom'))

# 3. Apple Watch (Supplier was ~2450 -> Expect ~2650 with +200)
watch = next((p for p in products if p.get('category') == 'watch'), None)
if watch:
    print('\nApple Watch sample priceFrom:', watch.get('name'), watch.get('priceFrom'))
