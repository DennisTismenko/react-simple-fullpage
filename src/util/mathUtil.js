/**
 * Decrements the value if the new value is greater than or equal to the specified lower bound
 */
export const decrementIfGte = (val, lowerBound) => {
  const newVal = val - 1;
  return newVal < lowerBound ? val : newVal;
};

/**
 * Increments the value if the new value is less than or equal to the specified upper bound
 */
export const incrementIfLte = (val, upperBound) => {
  const newVal = val + 1;
  return newVal > upperBound ? val : newVal;
};
