export const formatters = {
  isoToRegularDate(date: string) {
    return date ? date.split('-').reverse().join('/') : null
  },
  dateToString(date: Date) {
    return date ? date.toISOString().split('T')[0] : null
  },
}
