import os
import urllib.request

ASSETS = {
    # 1. iPhone Duo (Hero 1)
    "images/hero_iphone_duo_2x.jpg": "https://www.apple.com/v/homepage/images/iphone-duo/a/hero_iphone_duo_animated_preorder__c10i2x3qhi4i_large_2x.jpg",
    "images/hero_iphone_duo_small_2x.jpg": "https://www.apple.com/v/homepage/images/iphone-duo/a/hero_iphone_duo_animated_preorder__c10i2x3qhi4i_small_2x.jpg",
    "images/hero_iphone_duo_startframe_2x.jpg": "https://www.apple.com/v/homepage/images/iphone-duo/a/hero_iphone_duo_animated_startframe__blm9gj3ulmc2_large_2x.jpg",

    # 2. iPhone 18 Pro (Hero 2)
    "images/hero_iphone_18_pro_2x.jpg": "https://www.apple.com/v/homepage/images/iphone-18-pro/a/hero_iphone_18_pro__fqe1motd0ymy_large_2x.jpg",
    "images/hero_iphone_18_pro_small_2x.jpg": "https://www.apple.com/v/homepage/images/iphone-18-pro/a/hero_iphone_18_pro__fqe1motd0ymy_small_2x.jpg",

    # 3. Promo Grid Row 1: Apple Watch Series 12 & Apple Watch Ultra 4
    "images/promo_watch_s12_2x.jpg": "https://www.apple.com/v/homepage/images/apple-watch-series-12/a/promo_apple_watch_series_12__gnlprtt8526a_large_2x.jpg",
    "images/promo_watch_s12_small_2x.jpg": "https://www.apple.com/v/homepage/images/apple-watch-series-12/a/promo_apple_watch_series_12__gnlprtt8526a_small_2x.jpg",
    "images/promo_logo_watch_s12_2x.png": "https://www.apple.com/v/homepage/images/logos/apple-watch-series-12/a/promo_logo_apple_watch_series_12__eck6698frlqq_large_2x.png",

    "images/promo_watch_ultra4_2x.jpg": "https://www.apple.com/v/homepage/images/apple-watch-ultra-4/a/promo_apple_watch_ultra_4__e4r3qertak2u_large_2x.jpg",
    "images/promo_watch_ultra4_small_2x.jpg": "https://www.apple.com/v/homepage/images/apple-watch-ultra-4/a/promo_apple_watch_ultra_4__e4r3qertak2u_small_2x.jpg",
    "images/promo_logo_watch_ultra4_2x.png": "https://www.apple.com/v/homepage/images/logos/apple-watch-ultra-4/a/promo_logo_apple_watch_ultra_4__bc6ish8cjaeq_large_2x.png",

    # 4. Promo Grid Row 2: iPad Air M4 & Carrier / Trade-in Lineup
    "images/promo_ipad_air_m4_2x.jpg": "https://www.apple.com/v/homepage/images/ipad-air-m4/a/promo_ipad_air_m4__bgcv7t286k8y_large_2x.jpg",
    "images/promo_ipad_air_m4_small_2x.jpg": "https://www.apple.com/v/homepage/images/ipad-air-m4/a/promo_ipad_air_m4__bgcv7t286k8y_small_2x.jpg",
    "images/promo_logo_ipad_air_2x.png": "https://www.apple.com/v/homepage/images/logos/ipad-air-m4/a/promo_logo_ipad_air__dqdj4ni03quu_large_2x.png",

    "images/promo_carriers_2x.jpg": "https://www.apple.com/v/homepage/images/carriers/a/promo_carriers__bkbchi56n5qq_large_2x.jpg",
    "images/promo_carriers_small_2x.jpg": "https://www.apple.com/v/homepage/images/carriers/a/promo_carriers__bkbchi56n5qq_small_2x.jpg",

    # 5. Extra Promos: Apple Upgrade / Trade-In
    "images/promo_apple_upgrade_2x.jpg": "https://www.apple.com/v/homepage/images/apple-upgrade/a/promo_apple_upgrade__jvn6udm4tx2e_large_2x.jpg",
}

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "apple-official")

def download_all():
    os.makedirs(os.path.join(BASE_DIR, "images"), exist_ok=True)
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

    for rel_path, url in ASSETS.items():
        target_path = os.path.join(BASE_DIR, rel_path)
        print(f"Downloading {rel_path}...")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as resp:
                data = resp.read()
                with open(target_path, "wb") as f:
                    f.write(data)
            print(f" -> OK ({len(data)} bytes)")
        except Exception as e:
            print(f" -> ERROR {url}: {e}")

if __name__ == "__main__":
    download_all()
