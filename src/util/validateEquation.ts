/**
 * Checks if the passed string contains only numbers, arithmetic operators, and parentheses
 */
export function validateEquation(equation: string) {
    const regexp = /^[\d\s+*\/\-\(\)]+$/

    if (regexp.test(equation) === false) {
        throw new Error("Equation is not valid")
    }
}




