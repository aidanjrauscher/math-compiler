////////////////////////////////////////////////////////////////////////////////////////////////
// GOAL: create a compiler to turn natural language math expressions into 
//       proper math expressions with support for the four basic operations: +, -, *, /
// EXAMPLE 1: 
//          INPUT: multiply 4 and 2
//          OUTPUT: 4 * 2
// EXAMPLE 2: 
//          INPUT: subtract 2 from 4
//          OUTPUT: 4 - 2
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
// LEXICAL ANALYSIS - TOKENIZATION
// TASK: split input characters into tokens
function validateTokens(token){
    const tokenRegex = /^((add)|(multiply)|(subtract)|(divide)|(and)|(from)|(0|[1-9][0-9]*))$/
    return token.match(tokenRegex)
}

function tokenize(source){
    const tokens = source.trim().split(" ")
    //filter out empty tokens
    const filteredTokens = tokens.filter((token)=>{
        if(token.trim(" ")){
            return true
        }
        return false
    })
    //validate each token
    filteredTokens.forEach((token)=>{
        const isValid = validateTokens(token)
        if(!isValid){
            throw new Error("Invalid token in source code")
        }
    })
    return filteredTokens 
}
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
// SYNTACTICAL ANALYSIS - PARSING
// TASK: create an  a syntax tree from tokens

//recursion makes me sad
function buildAST(tokens){
    //base case: empty slice of tokens
    if(tokens.length == 0){
        return
    }
    //base case: operands are terminal nodes
    if (tokens.length === 1) {
        if(!tokens[0].match(/^(0|[1-9][0-9]*)$/g)){
            throw new Error("Invalid syntax in source code.")
        }
        return { type: 'operand', token: tokens[0] }
    }
    //initial case
    if(tokens[0].match(/^((add)|(multiply)|(subtract)|(divide))$/)){
        return { 
            type: "operator", 
            token: tokens[0], 
            children: {
                left: buildAST(tokens.slice(1,2)),
                right: buildAST(tokens.slice(2))
            } 
        }
    }
    //chaining operand 'and'
    const operatorIndex = tokens.findIndex((token) => (token === 'and' || token === 'from'))
    if(operatorIndex == 0){
        return {
            type: "operator",
            token: tokens[operatorIndex],
            children: {
                left: buildAST(tokens.slice(1,2)),
                right: buildAST(tokens.slice(2))
            }
        }
    }
    else{
        return {
            type: "operator",
            token: tokens[operatorIndex],
            children: {
                left: buildAST(tokens.slice(0,1)),
                right: buildAST(tokens.slice(2))
            }
        }
    }
}

function parse(tokens){
    const syntaxTree = buildAST(tokens)
    return syntaxTree
}
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
// SEMANTIC ANALYSIS - CHECKING
// TASK: check the syntax tree for semantic errors 

function check(tokens){
    const operation = tokens.slice(0,1)

    //throw an error if operation is divide and 0 shows up as a divsior
    const zeroIndex = tokens.indexOf("0")
    if(operation == "divide" && zeroIndex != -1 && zeroIndex != (tokens.length-1)){
        throw new Error("Invalid syntax in source code - division by zero.")
    }

    if((operation == "add" || operation == "multiply") && tokens.includes("from")){
        throw new Error("Invalid syntax in source code - wrong chaining operator for commutative operator.")
    }

    if((operation == "subtract" || operation == "divide") && tokens.includes("and")){
        throw new Error("Invalid syntax in source code - wrong chaining operator for noncommutative operator.")
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
// CODE GENERATION - WALKING
// TASK: traverse through the syntax tree and transform to the output lexicon to generate code

const operations = {
    "add" : "+",
    "multiply" : "*",
    "subtract" : "-",
    "divide" : "/"
}

function walk(syntaxTree){
    const outputArray = []
    const operatorString = syntaxTree.token
    const operatorSymbol = operations[operatorString]
    let leftChild = syntaxTree.children.left
    let rightChild = syntaxTree.children.right
    while(leftChild){
        outputArray.push(leftChild.token)
        if(rightChild){
            if(rightChild.type == "operator"){
                outputArray.push(operatorSymbol)
            }
            else{
                outputArray.push(rightChild.token)
            }
        }
        leftChild = rightChild?.children?.left
        rightChild = rightChild?.children?.right
    }
    //reverse array to capture precedence of syntax tree and join to form output code string
    return outputArray.reverse().join(" ")
}
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
// COMPILE - COMBINE STEPS
// TASK: tokenize, parse, and generate the code
export default function compile(source){
    const tokens = tokenize(source)
    const syntaxTree = parse(tokens)
    check(tokens)
    const code = walk(syntaxTree)
    return code
}
////////////////////////////////////////////////////////////////////////////////////////////////


