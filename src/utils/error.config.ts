export const ERROR_PROBABILITY = 0.25; // 25% chance of error

export const shouldThrowError = (): boolean => {
    return Math.random() < ERROR_PROBABILITY;
}; 