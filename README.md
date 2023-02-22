# fastify-post

A simple plugin for [Fastify][fastify] that adds a content type parser for
the content type `application/x-www-form-urlencoded` or `multipart/form-data`.

**This package is a ESM package. Your project needs to be ESM too. [Read more](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).**

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
  if (err) throw err
  console.log(`server listening on ${address}`)
})
```

```html
<form action="/" method="post" enctype="multipart/form-data">
  <input type="text" name="title" value="My Trip to Bali, Indonesia">
  <input type="text" name="tags" value="trip">
  <input type="text" name="tags" value="bali">
  <input type="file" name="featured_image">
  <input type="file" name="gallery" multiple>
  <button type="submit">Submit</button>
</form>
```
Output:

```json
{
  "title": "My Trip to Bali, Indonesia",
  "tags": ["trip", "bali"],
  "featured_image": {
    "fileName": "bali-featured.jpg",
    "fileMime": "image/jpeg",
    "filePath": "/tmp/MXFO0YahdwmflzBR1mSbCSN1.jpg",
    "fileSize": 28017,
    "fileExts": "jpg"
  },
  "gallery": [
    {
      "fileName": "pura.jpg",
      "fileMime": "image/jpeg",
      "filePath": "/tmp/oLJK4EvBwzQwuI73FS-nOZHx.jpg",
      "fileSize": 34664,
      "fileExts": "jpg"
    },
    {
      "fileName": "uluwatu.jpg",
      "fileMime": "image/jpeg",
      "filePath": "/tmp/cLbdgMDtPlh4HdzmUouhNm9t.jpg",
      "fileSize": 61525,
      "fileExts": "jpg"
    }
  ]
}

```

## Options

The plugin accepts an options object with the following properties:

- `bodyLimit`: The maximum amount of bytes to process before returning an error. If the limit is exceeded, a `500` error will be returned immediately. When set to `undefined` the limit will be set to whatever is configured on the parent Fastify instance. The default value is whatever is configured in [fastify](https://www.fastify.io/docs/latest/Reference/Server/#bodylimit) (`1048576` (1MB) by default).
- `maxFields`: Limits the number of fields that will be parsed before emitting an error event. A file counts as a field in this case. Defaults to `1000`.
- `maxFilesSize`: Limits the total bytes accepted for all files combined. If this value is exceeded, an error event is emitted. The default is `100 * 1024 * 1024` (100MB).
- `stringify`: Set object value as string. For example the value above will be `"featured_image": "{\"fileName\":\"bali-featured.jpg\",\"fileMime\":\"image/jpeg\",\"filePath\":\"/tmp/MXFO0YahdwmflzBR1mSbCSN1.jpg\",\"fileSize\":28017}"`. Enabling this option will be useful for JSON Schema body validation.
- `detectMime`: If set to `true`, a server side detection of the file type will be performed to avoid code injection attacks. Detection is done by package ["file-type"](https://github.com/sindresorhus/file-type).

## License

[MIT](https://github.com/erwinstone/fastify-post/blob/main/LICENSE)
