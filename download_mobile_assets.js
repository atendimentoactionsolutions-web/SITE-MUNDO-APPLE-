const https = require('https');
const fs = require('fs');
const path = require('path');

const smallImages = [
  // PROLED
  'https://www.apple.com/v/homepage/images/macbook-pro-proled-xdr/a/hero_macbook_pro_proled_xdr_animated_preorder__c7dgzbk10sqe_small_2x.jpg',
  'https://www.apple.com/v/homepage/images/macbook-pro-proled-xdr/a/hero_macbook_pro_proled_xdr_animated_preorder__c7dgzbk10sqe_small.jpg',
  // M6
  'https://www.apple.com/v/homepage/images/macbook-pro-m6/a/hero_macbook_pro_m6_announce__b04jni815ck2_small_2x.jpg',
  'https://www.apple.com/v/homepage/images/macbook-pro-m6/a/hero_macbook_pro_m6_announce__b04jni815ck2_small.jpg',
  // iMac
  'https://www.apple.com/v/homepage/images/imac-m6/a/hero_imac_m6_announce__bboowaq6op6q_small_2x.jpg',
  'https://www.apple.com/v/homepage/images/imac-m6/a/hero_imac_m6_announce__bboowaq6op6q_small.jpg',
  // Promos
  'https://www.apple.com/br/homepage/built/promos/26_iphone-duo_09/images/promo_iphone_duo_announce__cc65fv056p8i_small_2x.jpg',
  'https://www.apple.com/v/homepage/images/iphone-18-pro/a/promo_iphone_18_pro__9nn5m4mt2bmy_small_2x.jpg',
  'https://www.apple.com/br/homepage/built/promos/26_apple-watch-series-12_10/images/promo_apple_watch_series_12__gnlprtt8526a_small_2x.jpg',
  'https://www.apple.com/v/homepage/images/ipad-mini/a/promo_ipad_mini_a20_announce__efc6vmmxg58i_small_2x.jpg',
  'https://www.apple.com/v/homepage/images/apple-tv-4k/a/promo_apple_tv_4k_preorder__d4z5g4tm3qoi_small_2x.jpg',
  'https://www.apple.com/v/homepage/images/airpods-pro-3/a/promo_airpods_pro_3__e4755qofhnyq_small_2x.jpg',
];

const destDir = path.join(__dirname, 'public', 'apple-official', 'images');

smallImages.forEach(u => {
  const filename = path.basename(u);
  const dest = path.join(destDir, filename);
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => console.log('Downloaded mobile asset:', filename));
    } else {
      console.log('Failed:', res.statusCode, filename);
    }
  });
});
