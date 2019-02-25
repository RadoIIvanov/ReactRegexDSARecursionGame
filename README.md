# ReactRegexDSARecursionGame Purpose

The purpose of the game is to showcase and practice these concepts.
So, some of the features may appear "forced"/unnatural/uninteresting.

# Initial Structure

During development the game will use a stripped-down version of the skeleton that "npx create-react-app" provides.
Before finalizing the game, some of the structure that was stripped away will be re-created and extended for additional practice
and to improve understanding

# Game Rules

Somekind of CLock (built-in constraint)
Somekind of Outer Matrix Grid constraint (built-in constraint)
Somekind of HINT feature that each player can use (relieve constraint) (5 instances)
Anagrams of any words on the board provide 25% more points and an additional hint instance
Palindromes provide 25% more points and an additional restriction on location instance
Somekind of Game Theory (dynamic constraints, tactics, strategy)
** restrict location (5 instances), you have the ability to specify the location
** restrict letters (10 instances), restrict one vowel and 3 consonants

** cannot have repeating words

# Developing the UI

After each of the steps below, a commit/push will be made with its respective name

1. Mock UI specification
2. Break down the mock into react components and their relations
3. Build a static version of the mock
4. Define minimal state
5. Determine ownership of the state
6. Add inverse data flow (i.e. bottom-up)

# APIs and Packages - external dependencies

**Ditionary API to check Validity and Possibilities - Oxford/WordsAPI/Word Dictionary API(twinword) (try out multiple to be covered)
**Bing Spellcheck API

# JSON File Scripts

//// cannot push the api keys to github, at the end set up a basic restful backend with express and deploy it on heroku
