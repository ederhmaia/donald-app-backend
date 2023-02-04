type Maritage = 'Solteiro' | 'Casado' | 'Divorciado' | 'Viúvo' | 'Separado' | 'União Estável'

export interface Customer {
  name: string
  cpf: string
  rg: string
  birthDate: string
  phone: string
  address: string
  voterDoc: string
  city: string
  province: string
  signature: string
  maritalStatus: Maritage
  jobTitle: string
}

export interface File {
  status?: boolean
  fileName: string
  binaryData: string
}
