## Adding a service

1. Add the module to [services/](https://github.com/Jux/omniembed/blob/master/services), which should export a `regex` property and a `fromUrl()` method.
2. Add URLs and a subset of output (just enough to check that the response is valid) to [test/examples.json](https://github.com/Jux/omniembed/blob/master/test/examples.json).
3. Ensure that tests pass.

## Running tests

Note there are tests that make real API requests.

```bash
npm install -g grunt-cli
npm install
grunt
```
