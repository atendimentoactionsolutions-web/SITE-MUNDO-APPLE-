#!/bin/bash
# =========================================================================
# Sincronização Diária de Preços Loja Física Mundo Apple (11h30)
# =========================================================================

PROJECT_DIR="/Users/imac27/Desktop/PROJETO MUNDO APPLE "
LOG_FILE="$PROJECT_DIR/scripts/sync.log"

export PATH="/Users/imac27/.gemini/antigravity/bin:/Users/imac27/Library/Application Support/Antigravity/bin:/usr/local/bin:/opt/homebrew/bin:$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin:$PATH"

echo "==================================================" >> "$LOG_FILE"
echo "⏰ Iniciando sincronização: $(date)" >> "$LOG_FILE"
echo "==================================================" >> "$LOG_FILE"

cd "$PROJECT_DIR" || exit 1

# 1. Limpar arquivos temporários de build e puxar alterações
git checkout -- tsconfig.tsbuildinfo 2>/dev/null || true
git pull origin main --rebase >> "$LOG_FILE" 2>&1

# 2. Executar script de sincronização de preços
npx tsx scripts/sync-loja-fisica.ts >> "$LOG_FILE" 2>&1

# 3. Verificar se houve alteração e commitar
if [ -n "$(git status --porcelain src/data/products.ts)" ]; then
  git add src/data/products.ts
  git commit -m "chore(precos): atualização automática diária de preços Loja Física [11h30]" >> "$LOG_FILE" 2>&1
  git push origin main >> "$LOG_FILE" 2>&1
  echo "✅ Preços atualizados e enviados para o Vercel!" >> "$LOG_FILE"
else
  echo "ℹ️ Nenhum preço precisou ser alterado hoje." >> "$LOG_FILE"
fi

echo "🏁 Finalizado em $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
