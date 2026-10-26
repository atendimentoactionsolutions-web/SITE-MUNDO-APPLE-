import urllib.request, ssl, json
from collections import Counter

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    'https://srv2058756.hstgr.cloud/api/products',
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
    res = json.loads(resp.read().decode('utf-8'))

print('Success:', res.get('success'))
print('Total items:', res.get('total'))
print('Dollar rate:', res.get('dollarRate'))
print('Latest date:', res.get('latestDate'))

items = res.get('data', [])
if items:
    print('Sample item structure:', list(items[0].keys()))
    print('Sample item 0:', items[0])
    
    categories = Counter([item.get('category') or item.get('categoria') or item.get('tipo') for item in items])
    print('Categories counter:', categories)

    # Let's inspect some sample names
    sample_names = [item.get('name') or item.get('modelo') or item.get('title') for item in items[:15]]
    print('Sample names:', sample_names)
