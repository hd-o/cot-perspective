export const logger = {
  error(...values: unknown[]): void {
    console.error('cot-perspective:', ...values)
  },
  log(...values: unknown[]): void {
    // eslint-disable-next-line no-console
    console.log('cot-perspective:', ...values)
  },
}
