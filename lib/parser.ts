import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import path from 'path'

import { Customer, File } from 'types'

const generateDoc = async (customer: Customer, file: File) => {
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

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  })

  fs.writeFileSync(path.resolve(__dirname, `./${name}/${file.fileName}.docx`), buf)
}

const parseFiles = async (customer: Customer): Promise<void> => {
  const TEMPLATE_FOLDER: string = './templates'

  fs.readdir(TEMPLATE_FOLDER, (err, files): File | null | void => {
    if (err) {
      console.error(err)
      return null
    }

    const filterDocxFiles: string[] = files.filter((file) => path.extname(file) === '.docx')

    const fileMap: File[] = filterDocxFiles.map((file): File => {
      const binaryFile: string = fs.readFileSync(path.join(TEMPLATE_FOLDER, file), 'binary')
      return {
        fileName: file,
        binaryData: binaryFile,
      }
    })

    fileMap.forEach((binaryFile) => {
      generateDoc(customer, binaryFile)
    })
  })
}

export default parseFiles
