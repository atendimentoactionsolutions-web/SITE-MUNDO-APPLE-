import urllib.request, ssl, re, json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    'https://srv2058756.hstgr.cloud',
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
    html = res.read().decode('utf-8', 'ignore')

scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', html)
print('Script sources:', scripts)

endpoints = set(re.findall(r'["\'](/api/[^"\']+)["\']', html))
print('Endpoints found in HTML:', endpoints)

# Test common API endpoints
for ep in ['/api/products', '/api/prices', '/api/tabela', '/api/catalog', '/api/cotacoes']:
    try:
        r = urllib.request.Request(f'https://srv2058756.hstgr.cloud{ep}', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(r, context=ctx, timeout=5) as resp:
            data = resp.read()
            print(f'Endpoint {ep} -> Status {resp.status}, bytes: {len(data)}')
            try:
                j = json.loads(data)
                print(f'JSON keys for {ep}:', list(j.keys()) if isinstance(j, dict) else f'Array len {len(j)}')
            except:
                pass
    except Exception as e:
        print(f'Endpoint {ep} failed: {e}')
