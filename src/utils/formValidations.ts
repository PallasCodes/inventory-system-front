export const notEmpty = (val: string) =>
  (val && val.length > 0) || 'El campo es requerido'

export const notEmptyNumber = (val: number) =>
  (val && val.toString() !== '') || 'El campo es requerido'

export const selectNotEmpty = (val: any) => val || 'El campo es requerido'
