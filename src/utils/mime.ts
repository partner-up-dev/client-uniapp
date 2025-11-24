import { content_type_mapper } from '@/data/mapper'
import { type MIMETypes, type FileExtension } from '@/data/enum'

export function getMIMETypeFromFilename(filename: string): MIMETypes {
  const extension = filename.split('.').pop()!.toLowerCase() as FileExtension
  return content_type_mapper[extension] || "application/octet-stream"
}
