import requests
import re
import json
import codecs

# r = requests.get("https://pastebin.com/raw/kGcxffi3")
# questions = r.text

# matches = re.finditer(r"([0-9]{1,})\.\r\n(.*)\r\na\)\s(.*)\r\nb\)\s(.*)\r\nc\)\s(.*)\r\nd\)\s(.*)\r", questions)
# out = {}
# for m in matches:
#     question = {
#         "question": m.group(2),
#         "a": m.group(3),
#         "b": m.group(4),
#         "c": m.group(5),
#         "d": m.group(6),
#         "answer": 'x'
#     }
#     out[m.group(1)] = question

# with open('Jog_tesztkerdesek.txt', 'r') as file:
#     questions = file.readlines()

# print(question)

out = {}

r = requests.get("https://pastebin.com/raw/dd2PxN1X")
out = json.loads(r.text)
# print(questions)

r = requests.get("https://pastebin.com/raw/ZCNZUs0L")
answers = r.text

matches = re.finditer(r"([0-9]{1,})\s(\w)", answers)
for m in matches:
    if m.group(1) in out:
        out[m.group(1)]["answer"] = m.group(2).lower()

print(len(out.items()))

file = codecs.open("data.json", "w", "utf-8")
file.write(json.dumps(out, ensure_ascii=False))
file.close()