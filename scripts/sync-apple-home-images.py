"""Download the product banners used by Apple Brasil to local homepage assets."""
import concurrent.futures
import json
from pathlib import Path
import urllib.request

BASE = 'https://www.apple.com'
DEST = Path(__file__).resolve().parents[1] / 'public/apple-official/home'
SOURCES = {
    'holiday': '/br/homepage/built/heroes/26_holiday_11/images/hero_holiday_2026_pink__bc2rstir59lu_large.jpg',
    'duo': '/br/homepage/built/heroes/26_iphone-duo_09/images/hero_iphone_duo_announce__fh4u8yzndpe2_large.jpg',
    'proled': '/v/homepage/images/macbook-pro-proled-xdr/a/hero_macbook_pro_proled_xdr_preorder__df38n593sxg2_large.jpg',
    'iphone-pro': '/v/homepage/images/iphone-18-pro/a/promo_iphone_18_pro__9nn5m4mt2bmy_large.jpg',
    'watch': '/br/homepage/built/promos/26_apple-watch-series-12_10/images/promo_apple_watch_series_12__gnlprtt8526a_large.jpg',
    'macbook': '/v/homepage/images/macbook-pro-m6/a/promo_macbook_pro_m6_announce__fclfe7s84xiu_large.jpg',
    'imac': '/v/homepage/images/imac-m6/a/promo_imac_m6_announce__fd1gdwgpg2a2_large.jpg',
    'ipad': '/v/homepage/images/ipad-mini/a/promo_ipad_mini_a20_announce__efc6vmmxg58i_large.jpg',
    'airpods': '/v/homepage/images/airpods-pro-3/a/promo_airpods_pro_3__e4755qofhnyq_large.jpg',
    'watch-logo': '/v/homepage/images/logos/apple-watch-series-12/a/promo_logo_apple_watch_series_12__eck6698frlqq_large.png',
    'ipad-logo': '/v/homepage/images/logos/ipad-mini/a/promo_logo_ipad_mini_a20__dcndmemvplea_large.png',
}

def download(item):
    name, path, size = item
    # The holiday hero uses one composition at every viewport on the reference.
    variant = 'large' if name == 'holiday' else size
    url = BASE + path.replace('_large.', f'_{variant}_2x.')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as response:
        content_type = response.headers.get('Content-Type', '')
        data = response.read()
    if not content_type.startswith('image/') or not data:
        raise ValueError(f'Invalid image response: {url}')
    target = f'{name}-{size}{Path(path).suffix}'
    (DEST / target).write_bytes(data)
    print(f'{target}: {len(data)} bytes')
    return target, url

if __name__ == '__main__':
    DEST.mkdir(parents=True, exist_ok=True)
    jobs = [(name, path, size) for name, path in SOURCES.items()
            for size in (('large',) if name.endswith('-logo') or name == 'holiday' else ('large', 'small'))]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        manifest = dict(pool.map(download, jobs))
    (DEST / 'sources.json').write_text(json.dumps({'reference': BASE + '/br/', 'images': manifest}, indent=2) + '\n')
