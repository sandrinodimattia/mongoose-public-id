# mongoose-public-id

Generates a public ID for your models which you can expose in your API.

```js
{
  _id: '58e175ba8a7ca30011d39c8f',
  userId: '9zOROKPj4Ws4QzPaZGZK'
}
```

It also supports adding a prefix (similar how Stripe does it):

```js
{
  _id: '58e175ba8a7ca30011d39c8f',
  userId: 'us_9zOROKPj4Ws4QzPaZGZK'
}
```

> The plugin uses [hashids](http://hashids.org) to generate the public id based on the `_id`

## Installing

```
yarn install mongoose-public-id
```

## Usage

The following example will add a new indexed field `userId` to the model which will contain the public ID (eg: `us_lO1DEQWBbQAACfHO`) based on the `_id` field.

```javascript
const mongoose = require('mongoose');
const publicId = require('mongoose-public-id');

const UserSchema = new mongoose.Schema({
  username: String
});

UserSchema.plugin(publicId, {
  namespace: 'us', // optional
  prefix: '_' // default value,
  fieldName: 'userId',
  index: true // default value
});
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
