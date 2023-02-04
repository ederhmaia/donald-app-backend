import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import path from 'path'

import { Customer, File } from 'types'

const generateDoc = async (customer: Customer, file: File): Promise<Buffer> => {
  const doc = new Docxtemplater(new PizZip(file.binaryData), {
    paragraphLoop: true,
    linebreaks: true,
  })

  const { name, phone, cpf, rg, birthDate, address, voterDoc, city, province, maritalStatus, jobTitle, signature }: Customer = customer

  const placeholders: Customer = {
    name,
    phone,
    cpf,
    rg,
    birthDate,
    address,
    voterDoc,
    city,
    province,
    maritalStatus,
    jobTitle,
    signature: signature.toUpperCase(),
  }

  doc.render(placeholders)

  const DeflateBuffer = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  })
  // check if folder exists
  // if (!fs.existsSync(path.resolve(__dirname, `./${name}`))) {
  //   fs.mkdirSync(path.resolve(__dirname, `./${name}`))
  // }
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
  const DocumentsBuffer: any = await Promise.all(
    fileMap.map(async (binaryFile) => {
      const Buffer = await generateDoc(customer, binaryFile)
      const { data } = Buffer.toJSON()

      return {
        file: binaryFile.fileName,
        buffer: data,
      }
    })
  )

  return DocumentsBuffer

  // const DocumentsBuffer = fileMap.map(async (binaryFile) => {
  //   const Buffer = await generateDoc(customer, binaryFile)
  //   console.log(Buffer)
  //   console.log('-------------')
  //   return { file: binaryFile.fileName, buffer: Buffer }
  // })
}

export default parseFiles
