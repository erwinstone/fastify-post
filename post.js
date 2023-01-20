'use strict'

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
    form.parse(body, (err, fields, files) => {
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
            files[key] = fileFormat(val[0])
          } else {
            files[key] = val.map((i) => fileFormat(i))
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

function fileFormat(file) {
  if (file.size === 0) return null
  return {
    fileName: file.originalFilename,
    fileMime: file.headers['content-type'],
    filePath: file.path,
    fileSize: file.size,
  }
}

module.exports = fp(fastifyPost, {
  fastify: '4.x',
  name: 'fastify-post',
})
