import requests
import re
from bs4 import BeautifulSoup

pages = {
    'iphone': 'http://localhost:3000/iphone',
    'mac': 'http://localhost:3000/mac',
    'ipad': 'http://localhost:3000/ipad',
    'watch': 'http://localhost:3000/apple-watch',
    'airpods': 'http://localhost:3000/airpods',
    'accessories': 'http://localhost:3000/acessorios'
}

deactivated_slugs = [
    'apple-watch-s9', 'iphone-15-plus', 'iphone-16-pro-max', 'iphone-16e',
    'ipad-pro-m2-12-9', 'iphone-13', 'iphone-14-plus', 'iphone-16-pro',
    'airtag-2-1pack', 'iphone-16-plus', 'magic-keyboard-folio', 'iphone-15-pro-max'
]

print("Checking deactivated products on pages...")
for cat, url in pages.items():
    r = requests.get(url)
    html = r.text
    for slug in deactivated_slugs:
        if f'href="/produto/{slug}"' in html or f'href="/produtos/{slug}"' in html:
            print(f"WARNING: Deactivated {slug} found on {cat} page!")

print("Check finished.")
