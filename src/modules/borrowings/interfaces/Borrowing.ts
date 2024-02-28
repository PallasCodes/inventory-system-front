export interface Borrowing {
  idBorrowing?: string | null
  borrowingDate: string | null
  borrowingDeadline?: string
  returnDate?: string | null
  comments?: string
  idEmployee: string
  idItem: string
  sku: string
}
