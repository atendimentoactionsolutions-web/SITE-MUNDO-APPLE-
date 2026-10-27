import re

def normalize(s):
    if not s: return ""
    return re.sub(r'[^A-Z0-9]', '', s.upper())

def getModelKey(name):
    norm = normalize(name)
    if "MACMINIM4PRO" in norm: return "MACMINIM4PRO"
    if "MACMINIM4" in norm: return "MACMINIM4"
    if "MACMINIM6" in norm: return "MACMINIM6"
    if "MACMINI" in norm: return "MACMINI"
    return norm

print('Mac mini M4 ->', getModelKey('Mac mini M4'))
print('Mac mini M4 Pro ->', getModelKey('Mac mini M4 Pro'))
print('Supplier MAC MINI M4 ->', getModelKey('MAC MINI M4'))
print('Supplier MAC MINI M4 PRO ->', getModelKey('MAC MINI M4 PRO'))
print('Supplier MAC MINI M6 ->', getModelKey('MAC MINI M6'))
