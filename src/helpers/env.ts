import path from 'path'
import fs from 'fs'
export const {
    NODE_ENV = 'development',
    CWD = process.cwd(),
    PROD,
    DEV,
    VITE_NODE_ENV = 'development'
} = import.meta.env || process.env

// const temp = path.join(process.cwd(), 'public', 'file.ext') // local
// const temp = path.join('/tmp', 'file.ext'); // vercel
export const publicTemp = (...paths: string[]): string => {
    const folderWithArchive = DEV ? path.join(CWD, ...paths) : path.join('/tmp', ...paths)
    const directory = path.dirname(folderWithArchive)
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
    }
    return folderWithArchive
}
export const publicSrc = (...paths: string[]): string => path.join(CWD, ...paths)
