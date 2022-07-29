import { FastifyPlugin } from 'fastify'
import { File, Files } from 'formidable'

export interface FastifyPostOptions {
  bodyLimit?: number
  maxFileSize?: number
}

declare const fastifyPost: FastifyPlugin<FastifyPostOptions>

export default fastifyPost

export { File, Files }
