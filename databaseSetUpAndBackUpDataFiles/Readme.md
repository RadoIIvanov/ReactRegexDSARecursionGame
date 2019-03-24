# Steps, each step is a separate file (i.e. each step usually uses some of the functionality provided by the helper.js file)

1. get valid words from sowpods text file and put them in a map alonside the sum of their letter scores
2. get nGramFrequency data from the respective text file, calculate percentiles (relative ordering), and add them to the map from point 1
3. analyze the map => determine anagrams and palindromes, and add them to the map
4. turn the map into a mongodb collection and upload it to mlab (you would have to use your own username/password)
5. write the info to a separate txt/json file to be used as a backup, i.e. in case mlab is offline/inaccessible

# Text files are taken from http://norvig.com/ngrams/
