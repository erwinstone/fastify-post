'use strict'

const path = require('path')
const fp = require('fastify-plugin')
const { parse } = require('querystring')
const multiparty = require('multiparty')

function fastifyPost(fastify, options, next) {
  const bodyLimit = options.bodyLimit || fastify.initialConfig.bodyLimit
  fastify.addContentTypeParser(
    'application/x-www-form-urlencoded',
    { parseAs: 'buffer', bodyLimit },
    (_req, body, done) => {
      done(null, Object.assign({}, parse(body.toString())))
    }
  )
  fastify.addContentTypeParser('multipart', (_req, body, done) => {
    const form = new multiparty.Form({
      maxFieldsSize: bodyLimit,
      maxFields: options.maxFields || 1000,
      maxFilesSize: options.maxFilesSize || 100 * 1024 * 1024, //100MB
    })
    form.parse(body, async (err, fields, files) => {
      if (err) {
        done(err)
      } else {
        for (const key of Object.keys(fields)) {
          const val = fields[key]
          if (val.length === 1) {
            fields[key] = val[0]
          }
        }
        for (const key of Object.keys(files)) {
          const val = files[key]
          if (val.length === 1) {
            files[key] = await fileFormat(val[0], options.detectMime)
          } else {
            files[key] = await Promise.all(val.map((i) => fileFormat(i, options.detectMime)))
          }
          if (options.stringify === true) {
            files[key] = JSON.stringify(files[key])
          }
        }
        done(null, { ...fields, ...files })
      }
    })
  })
  next()
}

async function fileFormat(file, detectMime) {
  if (file.size === 0) return null
  let fileMime = file.headers['content-type']
  let fileExts = path.parse(file.path).ext.substring(1)
  if (detectMime === true) {
    const { fileTypeFromFile } = await import('file-type')
    const fileType = await fileTypeFromFile(file.path)
    if (fileType !== undefined) {
      fileMime = fileType.mime
      fileExts = fileType.ext
    }
  }
  return {
    fileName: file.originalFilename,
    fileMime,
    filePath: file.path,
    fileSize: file.size,
    fileExts: fileExts.toLowerCase(),
  }
}

module.exports = fp(fastifyPost, {
  fastify: '4.x',
  name: 'fastify-post',
})
