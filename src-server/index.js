import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()

app.use(cors())
app.use(express.static('public'))
app.use(express.json())

app.post('/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  const base = process.env.API_BASE
  let token = ''
  switch (req.body.type) {
    case '如何办':
      token = process.env.TOKEN_RUHEBAN
      break
    case '问政策':
      token = process.env.TOKEN_WENZHENGCE
      break
  }
  const difyRes = await fetch(`${base}/chat-messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {},
      query: req.body.query,
      user: req.body.user || 'default',
      response_mode: 'streaming',
    }),
  })
  difyRes.body.pipe(res)
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
