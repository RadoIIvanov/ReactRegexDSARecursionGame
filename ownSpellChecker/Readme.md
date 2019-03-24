# Simple spellChecker

Only simple missplellings will be tolerated (i.e. the distance between the wrong spelling and right one must be small). Additionally, the misspelled words will only be counted if :

1. They fit in the place on the grid (i.e. there may be issues if letters are added or removed => need to check validity (adjacency, already filled places etc.))
2. Have a higher frequency of use (i.e. at least 5% more than the next options that fits in the grid) compared to the other words in the set

Types of simple wrong spelling:

1. Missing a letter
2. Having an unnecessary letter
3. Having one wrong letter (i.e. same length)
4. Having the wrong order in adjacent letters (i.e. swapping letters next to each other)
