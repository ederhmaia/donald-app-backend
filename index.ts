import express, { Express, Request, Response } from 'express'
import parseFiles from './lib/parser'
import cors from 'cors'

const app: Express = express()

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World')
})

app.post('/documents', (req: Request, res: Response) => {
  const data = req.body
  parseFiles(data)
  res.status(200).send('ok')
})

app.listen(3666, () => {
  console.log('running')
})
