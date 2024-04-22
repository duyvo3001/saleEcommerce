import  * as TestFunc from "../sum";

const { sum } = jest.requireActual<typeof TestFunc>("../sum.ts")

const successCase = [
    {
        id: 0,
        input: { a: 1, b: 1 },
        output: 2
    },
    {
        id: 1,
        input: { a: 2, b: 3 },
        output: 5
    }, {
        id: 2,
        input: { a: 3, b: 4 },
        output: 7
    }, {
        id: 3,
        input: { a: 5, b: 6 },
        output:11
    },
]

describe("TestFunc", () => {
    it.each(successCase)("success case should " , ({input,output})=>{
        const {a,b} = input;
        expect(sum(a,b)).toBe(output)
    })
})