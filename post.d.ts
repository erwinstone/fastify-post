import { FastifyPlugin } from 'fastify'

export interface FastifyPostOptions {
  bodyLimit?: number
  maxFields?: number
  maxFilesSize?: number
}

export interface File {
  fileName: string
  fileMime: string
  filePath: string
  fileSize: number
}

declare const fastifyPost: FastifyPlugin<FastifyPostOptions>

export default fastifyPost
