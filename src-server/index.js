import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import RPCClient from '@alicloud/pop-core'
import axios from 'axios'
import path from 'path'

const app = express()

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdirs('uploads')
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)
  },
})

const upload = multer({ storage })

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

const tokenCache = { value: null, expire: 0 }
async function getToken() {
  if (Date.now() < tokenCache.expire) return tokenCache.value

  const client = new RPCClient({
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET,
    endpoint: 'http://nls-meta.cn-shanghai.aliyuncs.com',
    apiVersion: '2019-02-28',
  })
  const ret = await client.request('CreateToken')
  tokenCache.value = ret.Token.Id
  tokenCache.expire = Date.now() + 23 * 3600 * 1000 // 23 h 后过期
  return tokenCache.value
}

app.post('/asr', upload.single('file'), async (req, res) => {
  const token = await getToken()
  const url = 'https://nls-gateway-cn-beijing.aliyuncs.com/stream/v1/asr'
  const file = await fs.readFile(req.file.path)
  const { data } = await axios.post(url, file, {
    params: {
      appkey: process.env.APP_KEY,
      format: 'wav',
      sample_rate: 16000,
      enable_punctuation_prediction: true,
    },
    headers: {
      'X-NLS-Token': token,
      'Content-Type': 'application/octet-stream',
    },
  })
  await fs.remove(req.file.path)
  res.json(data)
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
