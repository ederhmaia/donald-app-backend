import express, { Express, Request, Response } from 'express'
import parseFiles from './lib/parser'
import cors from 'cors'

const app: Express = express()

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World')
})

app.post('/download-documents', (req: Request, res: Response) => {
  const data = req.body
  parseFiles(data)
    .then((result) => {
      result.map((r: any) => {
        res.download(r.path, r.name)
      })
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

app.get('/queue', (req: Request, res: Response) => {})
app.get('/queue/:id', (req: Request, res: Response) => {})
app.get('/queue/:id/status', (req: Request, res: Response) => {})

app.post('/signin', (req: Request, res: Response) => {})
app.post('/signout', (req: Request, res: Response) => {})
app.post('/signup', (req: Request, res: Response) => {})
app.post('/forgot-password', (req: Request, res: Response) => {})
app.post('/reset-password', (req: Request, res: Response) => {})
app.post('/change-password', (req: Request, res: Response) => {})
app.post('/change-email', (req: Request, res: Response) => {})
app.post('/change-phone', (req: Request, res: Response) => {})

app.listen(3666, () => {
  console.log('running')
})
