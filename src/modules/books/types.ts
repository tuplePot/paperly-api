export type BookFormat = 'epub' | 'pdf' | 'txt'

export interface IBook {
  title: string
  author: string
  format: BookFormat
  file_size: number
  uploaded_by: string
}
