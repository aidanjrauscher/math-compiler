# Basic Compiler (implemented in JavaScript)


### TL;DR
I got bored so I made a simple compiler. 


### What it does
The toy compiler takes natural language math expressions and converts them into symbolic math expressions. 

It can handle the four basic arithmetic operations: +, *, -, /. 

Additionally, the compiler can handle chaining operators "and" and "from," used to chain additional operands for commutative and noncommutative operations, respectively. 

The syntax for commutitative operations: \<operation> \<number> and \<number> [and \<number>...]
- Example: 'add 2 and 4' is equivalent to '2 + 4'

The syntax for noncommutitative operations: \<operation> \<number> from \<number> [from \<number>...]
- Example: 'divide 2 from 4' is equivalent to '4 / 2'


### How it works
1. Tokenize the input source code and validate each token
2. Parse the tokens to build an abstract symbol tree
3. Check the tokens for semantic errors
4. Generate the output code by traversing the abstract symbol tree and transforming to the output lexicon



