import os

files_to_update = [
    'src/app/airpods/page.tsx',
    'src/app/acessorios/page.tsx',
    'src/app/apple-watch/page.tsx',
    'src/app/ipad/page.tsx',
    'src/app/mac/page.tsx',
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_vh = content.find('{/* Value Highlights */}')
    if start_vh != -1:
        # find the end of this div
        end_vh = content.find('</div>\n        </div>', start_vh)
        if end_vh != -1:
            end_vh += len('</div>\n        </div>')
            content = content[:start_vh] + content[end_vh:]
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Highlights removidos de: {file_path}")
        else:
            print(f"End tag nao encontrado em: {file_path}")
