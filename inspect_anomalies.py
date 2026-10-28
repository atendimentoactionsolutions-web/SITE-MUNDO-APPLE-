import urllib.request, json

req = urllib.request.Request(
    'https://mundoappledelivery.com/api/products/live',
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req, timeout=10) as res:
    data = json.loads(res.read().decode('utf-8'))

products = data.get('products', [])
print(f"Total products live: {len(products)}")

for p in products:
    name = p.get('name')
    priceFrom = p.get('priceFrom')
    variants = p.get('variants', [])
    variant_prices = [v.get('price') for v in variants if v.get('price') is not None]
    
    # Check anomalies: 
    # 1. priceFrom == 0
    # 2. priceFrom < 500 for iPhones/Macs/iPads/Watches
    # 3. discrepancy between priceFrom and variant prices
    # 4. suspiciously high or low prices
    cat = p.get('category')
    min_v = min(variant_prices) if variant_prices else None
    max_v = max(variant_prices) if variant_prices else None
    
    anomalies = []
    if priceFrom == 0:
        anomalies.append("ZERADO")
    if cat in ['iphone', 'mac'] and priceFrom and priceFrom < 2000:
        anomalies.append(f"PREÇO MUITO BAIXO ({priceFrom})")
    if cat == 'ipad' and priceFrom and priceFrom < 1500:
        anomalies.append(f"PREÇO MUITO BAIXO ({priceFrom})")
    if cat == 'watch' and priceFrom and priceFrom < 1000:
        anomalies.append(f"PREÇO MUITO BAIXO ({priceFrom})")
    if min_v and priceFrom and abs(priceFrom - min_v) > 2000:
        anomalies.append(f"DESVIO priceFrom({priceFrom}) != minVariant({min_v})")
        
    if anomalies or True:
        v_summary = ", ".join([f"{v.get('storage', '')} {v.get('color', '')}: {v.get('price')}" for v in variants[:3]])
        if anomalies:
            print(f"⚠️ [{cat.upper()}] {name}: R$ {priceFrom} | Alertas: {anomalies} | Vars: {v_summary}")
        else:
            # print normal for inspection
            pass
