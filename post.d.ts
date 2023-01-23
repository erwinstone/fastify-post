import { FastifyPluginCallback } from 'fastify'

export interface FastifyPostOptions {
  bodyLimit?: number
  maxFields?: number
  maxFilesSize?: number
  stringify?: boolean
  detectMime?: boolean
}

export interface File {
  fileName: string
  fileMime: string
  filePath: string
  fileSize: number
  fileExts: number
}

declare const fastifyPost: FastifyPluginCallback<FastifyPostOptions>

export default fastifyPost
