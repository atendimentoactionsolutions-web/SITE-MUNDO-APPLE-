const fs = require('fs');
let text = fs.readFileSync('src/app/admin/vendas/page.tsx', 'utf8');

const target = 'href="/admin/vendas/precos"';
const injection = '<Link\n              href="/admin/produtos"\n              className="px-4 py-2.5 bg-apple-dark hover:bg-black text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center gap-2"\n            >\n              <Sparkles className="w-4 h-4 text-amber-400" />\n              <span>Produtos Novos Lacrados</span>\n            </Link>\n\n            <Link\n              href="/admin/vendas/precos"';

if (text.includes(injection)) {
  console.log('Already injected!');
} else {
  text = text.replace(
    '<Link\n              href="/admin/vendas/precos"',
    injection
  );
  if (!text.includes('href="/admin/produtos"')) {
    text = text.replace(
      '<Link\r\n              href="/admin/vendas/precos"',
      injection.replace(/\n/g, '\r\n')
    );
  }
  fs.writeFileSync('src/app/admin/vendas/page.tsx', text, 'utf8');
  console.log('Admin vendas page updated!');
}
