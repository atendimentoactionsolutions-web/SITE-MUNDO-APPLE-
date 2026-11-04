import paramiko
import sys

def check_transcript():
    # Let's inspect step 2345 or step 2303 from transcript to see how previous deploy was done
    pass

with open(r'C:\Users\Mundo Apple\.gemini\antigravity\brain\0ba3281c-88d3-415e-b5f2-f6880d99ece5\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    import json
    for line in f:
        obj = json.loads(line)
        if obj.get('step_index') in [2303, 2345]:
            print(f"Step {obj.get('step_index')}:")
            for c in obj.get('tool_calls', []):
                print(c)
