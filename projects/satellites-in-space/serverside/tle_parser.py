import json;

data = {}
data['satellites'] = []
def appendSat(name, tle1, tle2):
    data['satellites'].append({
        'name': f'{name}',
        'tle1': f'{tle1}',
        'tle2': f'{tle2}'
    })

print("Reading tle data")

numSats = 0
with open("TLE.txt", "r") as reader:
    name, tle1, tle2 = "", "", ""
    line = reader.readline()
    while line != '':
        index = line[0]
        if(index == "0"):
            name = line[2:-1]
        if(index == "1"):
            tle1 = line[:-1]
        if(index == "2"):
            tle2 = line[:-1]
            if("DEB" not in name):
                appendSat(name, tle1, tle2)
                numSats += 1

        line = reader.readline()

print(f"Read {numSats} satellite's tle data")
print("Writing tle data to JSON file")

with open("sat.json", "w") as outfile:
    json.dump(data, outfile)

print("Complete!")
