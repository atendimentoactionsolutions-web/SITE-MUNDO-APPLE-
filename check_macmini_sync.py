import urllib.request, json, re

req = urllib.request.Request('https://srv2058756.hstgr.cloud/api/products', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.loads(r.read().decode('utf-8'))
items = [i for i in data.get('data', []) if not i.get('isSeminovo') and i.get('condition') != 'SEMINOVO' and i.get('category') != 'SEMI']

def norm(s):
    return re.sub(r'[^A-Z0-9]', '', (s or '').upper())

def getModelKey(name):
    n = norm(name)
    if "MACMINI" in n: return "MACMINI"
    return n

print("In supplier with MACMINI:")
for i in items:
    if "MACMINI" in norm(i.get('name') or ''):
        print(f"Name: {i.get('name')} | Price: {i.get('price')} | Stg: {i.get('storage')} | ModelKey: {getModelKey(i.get('name'))}")
