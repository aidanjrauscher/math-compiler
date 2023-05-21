import compile from "./index.js"

const e1 = "add 2 and 2"
const e2 = "multiply 2 and 4"
const e3 = "divide 2 from 4"
const e4 = "subtract 2 from 4"
const e5 = "add 2 and 2 and 2 and 2 and 2 and 2 and 2 and 2"

console.log("Natural Language: " + e1)
console.log("Symbolic: " + compile(e1))

console.log("Natural Language: " + e2)
console.log("Symbolic: " + compile(e2))

console.log("Natural Language: " + e3)
console.log("Symbolic: " + compile(e3))

console.log("Natural Language: " + e4)
console.log("Symbolic: " + compile(e4))

console.log("Natural Language: " + e5)
console.log("Symbolic: " + compile(e5))