export function validateEquation(equation: string) {
    const regexp = /^[\d\s+*\/\-\(\)]+$/

    if (regexp.test(equation) === false) {
        throw new Error("Equation is not valid")
    }
}




