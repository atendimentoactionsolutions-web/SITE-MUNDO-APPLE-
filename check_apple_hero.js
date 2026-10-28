const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  // Hero 1: PROLED XDR
  'https://www.apple.com/v/homepage/images/macbook-pro-proled-xdr/a/hero_macbook_pro_proled_xdr_animated_preorder_startframe__dnrzzn9ywj2a_large_2x.jpg',
  'https://www.apple.com/v/homepage/images/macbook-pro-proled-xdr/a/hero_macbook_pro_proled_xdr_animated_preorder_startframe__dnrzzn9ywj2a_large.jpg',
  'https://www.apple.com/v/homepage/images/macbook-pro-proled-xdr/a/hero_macbook_pro_proled_xdr_animated_preorder__c7dgzbk10sqe_large_2x.jpg',
  'https://www.apple.com/v/homepage/images/macbook-pro-proled-xdr/a/hero_macbook_pro_proled_xdr_animated_preorder__c7dgzbk10sqe_large.jpg',
  // Hero 2: M6
  'https://www.apple.com/v/homepage/images/macbook-pro-m6/a/hero_macbook_pro_m6_announce__b04jni815ck2_large_2x.jpg',
  'https://www.apple.com/v/homepage/images/macbook-pro-m6/a/hero_macbook_pro_m6_announce__b04jni815ck2_large.jpg',
  // Hero 3: iMac
  'https://www.apple.com/v/homepage/images/imac-m6/a/hero_imac_m6_announce__bboowaq6op6q_large_2x.jpg',
  'https://www.apple.com/v/homepage/images/imac-m6/a/hero_imac_m6_announce__bboowaq6op6q_large.jpg',
];

const destDir = path.join(__dirname, 'public', 'apple-official', 'images');

urls.forEach(u => {
  const filename = path.basename(u);
  const dest = path.join(destDir, filename);
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => console.log('Downloaded:', filename));
    } else {
      console.log('Failed:', res.statusCode, filename);
    }
  });
});
