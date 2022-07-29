'use strict'

const fp = require('fastify-plugin')
const { parse } = require('querystring')
const formidable = require('formidable')

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
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      maxFieldsSize: bodyLimit,
      maxFileSize: options.maxFileSize || 100 * 1024 * 1024 //100MB
    })
    form.parse(body, (err, fields, files) => {
      if (err) {
        done(err)
      } else {
        let jsonFiles = {}
        if (files) {
          for (const key of Object.keys(files)) {
            if (Array.isArray(files[key])) {
              jsonFiles[key] = []
              for (const i of files[key]) {
                const jsonData = i.toJSON()
                jsonFiles[key].push(jsonData.size > 0 ? jsonData : null)
              }
            } else {
              const jsonData = files[key].toJSON()
              jsonFiles[key] = jsonData.size > 0 ? jsonData : null
            }
          }
        }
        done(null ,{ ...fields, ...jsonFiles })
      }
    })
  })
  next()
}

module.exports = fp(fastifyPost, {
  fastify: '4.x',
  name: 'fastify-post'
})
