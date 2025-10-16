import { execa } from 'execa'
import fs from 'fs-extra'

fs.removeSync('release')

await execa({ stdio: 'inherit' })`pnpm frontend:build`
await execa({ stdio: 'inherit' })`pnpm backend:build`

fs.copyFileSync('.env', 'release/.env')
