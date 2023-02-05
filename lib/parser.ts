import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import path from 'path'

import { Customer, File } from 'types'

const generateDoc = async (customer: Customer, file: File): Promise<Buffer> => {
  const document = new Docxtemplater(new PizZip(file.binaryData), {
    paragraphLoop: true,
    linebreaks: true,
  })

  const placeholders = {
    ...customer,
    signature: customer?.signature?.toUpperCase() ?? '',
  }

  document.render(placeholders)

  const DeflateBuffer = document.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  })

  return DeflateBuffer
}

const parseFiles = async (customer: Customer): Promise<any> => {
  const TEMPLATE_FOLDER: string = './templates'

  const files: string[] = fs.readdirSync(TEMPLATE_FOLDER)
  const docxFiles: string[] = files.filter((file) => path.extname(file) === '.docx')

  const fileMap: File[] = docxFiles.map((docxFile): File => {
    const binaryFile: string = fs.readFileSync(path.join(TEMPLATE_FOLDER, docxFile), 'binary')
    return {
      fileName: docxFile,
      binaryData: binaryFile,
    }
  })
  const DocumentsBuffer = await Promise.all(
    fileMap.map(async (binaryFile) => {
      const Buffer = await generateDoc(customer, binaryFile)
      const { data } = Buffer.toJSON()

      return {
        file: binaryFile.fileName,
        buffer: 'testing',
        // buffer: data
      }
    })
  )

  return DocumentsBuffer
}

export default parseFiles
