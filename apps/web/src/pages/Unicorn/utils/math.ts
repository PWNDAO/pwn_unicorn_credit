export const calculateLtv = (creditAmount: number, collateralAmount: number) => {
  return ((creditAmount / collateralAmount) * 100).toFixed(2)
}
