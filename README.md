# fastify-post

A simple plugin for [Fastify][fastify] that adds a content type parser for
the content type `application/x-www-form-urlencoded` or `multipart/form-data`.

[fastify]: https://www.fastify.io/

## Usage/Examples

```javascript
import fastify from 'fastify'
import fastifyPost from 'fastify-post'

const app = fastify()

app.register(fastifyPost)

app.post('/', (req, reply) => {
	reply.send(req.body)
})

app.listen({ port: 8000 }, (err, address) => {
	if (err) {
		console.log(err)
		process.exit(1)
	}
	console.log(`server listening on ${address}`)
})
```

## Options

The plugin accepts an options object with the following properties:

- `bodyLimit`: The maximum amount of bytes to process before returning an error. If the limit is exceeded, a `500` error will be returned immediately. When set to `undefined` the limit will be set to whatever is configured on the parent Fastify instance. The default value is whatever is configured in [fastify](https://www.fastify.io/docs/latest/Reference/Server/#bodylimit) (`1048576` by default).
- `maxFileSize`: Limit the size of uploaded file. Default `100 * 1024 * 1024` (100MB)

## License

[MIT](https://github.com/erwinstone/fastify-post/blob/main/LICENSE)
