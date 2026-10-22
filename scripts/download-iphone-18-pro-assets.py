import os
import urllib.request
import re

out_dir = "public/apple-official/iphone-18-pro"
os.makedirs(out_dir, exist_ok=True)

url = "https://www.apple.com/br/iphone-18-pro/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
html = urllib.request.urlopen(req).read().decode("utf-8")

# Extract all unique assets we need
asset_paths = [
    # Hero
    "/v/iphone-18-pro/a/images/overview/media-hero/hero_startframe__ck15fj8f67hy_large.jpg",
    "/v/iphone-18-pro/a/images/overview/media-hero/hero_endframe__fbxsnz8txcia_large.jpg",
    # Colors / 3D product-viewer fallback
    "/v/iphone-18-pro/a/images/overview/product-viewer/color_burgundy__cx0t3q72064m_large.jpg",
    "/v/iphone-18-pro/a/images/overview/product-viewer/color_black__dseo2tvypuc2_large.jpg",
    "/v/iphone-18-pro/a/images/overview/product-viewer/color_silver__c0oudn0fzw4m_large.jpg",
    "/v/iphone-18-pro/a/images/overview/product-viewer/color_glacial__e9u49z5u96ae_large.jpg",
    # Camera
    "/v/iphone-18-pro/a/images/overview/pro-camera/system/camera_system_startframe__e0gisudnvv2a_large.jpg",
    "/v/iphone-18-pro/a/images/overview/pro-camera/aperture/max_depth__chz65982bi4i_large.jpg",
    # Performance & Chip
    "/v/iphone-18-pro/a/images/overview/performance/chip_startframe__cbo2noldjewi_large.jpg",
    "/v/iphone-18-pro/a/images/overview/performance/icon_a20__dhsqkelmytg2_large.png",
    "/v/iphone-18-pro/a/images/overview/performance/icon_ai__cdtqv8s8tm82_large.png",
    # Battery
    "/v/iphone-18-pro/a/images/overview/battery/hero__elo7tt0mnqy6_large.jpg",
    # Contrast / Highlights
    "/v/iphone-18-pro/a/images/overview/contrast/apple_intelligence__bj6vdt2qskmu_large.png",
    "/v/iphone-18-pro/a/images/overview/contrast/iphone_18_pro_camera__cr03lr3qm8cy_large.png",
    # AR Model
    "/105/media/ww/iphone-18-pro/2026/591df885-5ee2-4173-86e6-401021249f7c/ar/iPhone18-Pro_iPhone18-Pro-Max_p-sim_Burgundy.usdz"
]

# Look for actual URLs in HTML matching each keyword
for keyword in ["color_burgundy", "color_black", "color_silver", "color_glacial", "hero_startframe", "hero_endframe", "camera_system_startframe", "chip_startframe", "hero__elo7tt0mnqy6"]:
    m = re.findall(rf'(/v/iphone-18-pro/a/images/[^\s\"\'\)]*{keyword}[^\s\"\'\)]*large\.[a-z]+)', html)
    if m:
        cleaned = m[0].split(",")[0].strip()
        if cleaned not in asset_paths:
            asset_paths.append(cleaned)

print(f"Total assets to download: {len(asset_paths)}")

downloaded = 0
for path in asset_paths:
    clean_path = path.split(",")[0].strip()
    filename = clean_path.split("/")[-1].split("__")[0] + ("." + clean_path.split(".")[-1])
    # Handle USDZ special name
    if clean_path.endswith(".usdz"):
        filename = "iphone_18_pro_ar.usdz"
    
    full_url = f"https://www.apple.com{clean_path}" if clean_path.startswith("/") else clean_path
    target = os.path.join(out_dir, filename)
    
    try:
        req = urllib.request.Request(full_url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
        with urllib.request.urlopen(req) as resp, open(target, "wb") as out_file:
            data = resp.read()
            out_file.write(data)
            print(f"✓ Downloaded {filename} ({len(data)} bytes)")
            downloaded += 1
    except Exception as e:
        print(f"✗ Failed {filename} from {full_url}: {e}")

print(f"Finished! Successfully downloaded {downloaded}/{len(asset_paths)} assets.")
