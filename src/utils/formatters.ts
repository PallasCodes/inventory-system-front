export const formatters = {
  isoToRegularDate(date: string) {
    return date ? date.split('-').reverse().join('/') : null
  },
}
