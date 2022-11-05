import re
# Function that takes regex strings from admin_updates/en_GB_cleanup.txt and replaces them in the TextGrid
# The lines in the cleanup file are in the format: "srcregex" substitute "replacementregex" 
# Only replace in lines that match /text = "(.*)"/ the capture group being the text to be modified

def replaceTextGridTranscript(inputFile, cleanupFile):
    # Read the cleanup file into a dictionary
    cleanupDict = {}
    with open(cleanupFile, "r",encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line.startswith("#"):
                continue
            if line == "":
                continue
            print(line)
            src, repl = line.split('substitute')
            cleanupDict[src.replace('"','').strip()] = repl.replace('"','').strip()
            print(cleanupDict)
    # Read the TextGrid file into a list of lines
    with open(inputFile, "r",encoding='utf-16-be') as f:
        lines = f.readlines()
    # Replace the text in the TextGrid file
        for i, line in enumerate(lines):
            if re.match(r'.*text = "(.*)"', line.strip()):
                for src, repl in cleanupDict.items():
                    lines[i] = re.sub(src, repl, line)
    # Write the TextGrid file
    with open(inputFile, "w",encoding='utf-16-be') as f:
        f.writelines(lines)


replaceTextGridTranscript("test.TextGrid", "admin_updates/en_GB_cleanup.txt")