export const formatters = {
  isoToRegularDate(date: string) {
    return date ? date.split('-').reverse().join('/') : null
  },
  dateToString(date: Date) {
    return date ? date.toISOString().split('T')[0] : null
  },
  pad(num: number, size: number) {
    let auxNum = num.toString()
    while (auxNum.length < size) auxNum = '0' + auxNum
    return auxNum
  },
}
