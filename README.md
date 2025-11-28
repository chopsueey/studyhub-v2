## studyhub

I wanted something to collect all of my notes at one place, as my notes are usually
scattered across my desktop and other folders. Additionally, I thought it would be cool, if I could
just pass my note and it's content directly to any AI provider just by clicking a button.

I am using the google gemini api with the free gemini flash model to give me a summary
(or a quiz or whatever you want) to get the key information within just a snap.

### Demo
[![Watch the demo](https://img.youtube.com/vi/kMkPbBJ2p7Q/0.jpg)](https://www.youtube.com/watch?v=kMkPbBJ2p7Q)

### Get started

Prereq:

Node installed 
+
a MongoDB cluster (its free) and
a gemini api key (also free).

Clone or download the repo,

Run:
```bash
npm install --force
```

Create a .env.local file in the root and 
add your MongoDB URI and the gemini api key.

Run:
```bash
npm run dev
```
or
```bash
npm run build && npm start
```
