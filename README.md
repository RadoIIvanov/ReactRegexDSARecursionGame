# ReactRegexDSARecursionGame Purpose

The purpose of the game is to showcase and practice these concepts.
So, some of the features may appear "forced"/unnatural/uninteresting.

# Initial Structure

During development the game will use a stripped-down version of the skeleton that "npx create-react-app" provides.
Before finalizing the game, some of the structure that was stripped away will be re-created and extended for additional practice
and to improve understanding

# Game Rules

Somekind of Clock (built-in constraint)
Somekind of Outer Matrix Grid constraint (built-in constraint)
Somekind of HINT feature that each player can use (relieve constraint) (5 instances)
Anagrams of any words on the board provide 25% more points and an additional hint instance
Palindromes provide 25% more points and an additional restriction on location instance
Somekind of Game Theory (dynamic constraints, tactics, strategy)
** restrict location (5 instances), you have the ability to specify the location
** restrict letters (10 instances), restrict one vowel and 3 consonants
\*\* If you mispell a word, but the the bing API recognizes it with high degree of confidence and its placement within the grid
is still valid, you get 75% of the points and the correct spelling is automatically put on the board
If the above is not the case, you get to try again but you will receive only 50% credit in case of valid answers (i.e. this penalty flag will be carried over across turns until you pay the piper).

words are read either top-bottom or left-right, a play is valid if it forms a word 1. by using letters from words currently placed on the board (i.e. cannot use letters from previously placed words on the same row/column) OR 2. that is adjacent to letter(s) of at least one already placed word (i.e. parallel, next to horizontal/perpendicular, perpendicular)

Keep in mind that unlike scrabble, adding letters to an already placed word on the board does not count as a new word unless you form another main word first (i.e. you play your main word perpendicular to an already placed word and through this process you happen to add letters to the previously placed word, e.g. hooking, only then both words will be counted). This is done to avoid poorly incentivizing the players to play many derivatives of the same word.

\*\* cannot have repeating words, first word needs to be in the middle, whoever goes first needs to be restricted, so that first move is not a big advantage

who goes first will be determine by coin toss, after that the player that is first will be asked for a word and a direction(horizontal/vertical)
after that if the word is valid, it will automatically be put on the board and centered. After the first move, players will put words on the board themselves.

# Developing the UI

After each of the steps below, a commit/push will be made with its respective name

1. Mock UI specification
2. Break down the mock into react components and their relations
3. Build a static version of the mock
4. Define minimal state
5. Determine ownership of the state
6. Add inverse data flow (i.e. bottom-up)

# APIs and Packages - external dependencies

\*\*Ditionary API to check Validity and Possibilities - Oxford/WordsAPI/Word Dictionary API(twinword) (try out multiple to be covered)

# JSON File Scripts

//// cannot push the api keys to github, at the end set up a basic restful backend with express and deploy it on heroku

# Player vs Computer

This is where the majority of DSA(recursion, regex, combinations etc.)
