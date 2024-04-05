let functions = [x => x + 1, x => x * x, x => 2 * x]
let x = 4
for (let i = functions.length - 1; i >= 0; i--) {
    x = functions[i](x)
    console.log(x)
}
// console.log('he;;;p')