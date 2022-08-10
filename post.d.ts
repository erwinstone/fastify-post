import { FastifyPluginCallback } from 'fastify'

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

declare const fastifyPost: FastifyPluginCallback<FastifyPostOptions>

export default fastifyPost
