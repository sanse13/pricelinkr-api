module.exports = {
  api: {
    input: './swagger.json',
    output: {
      mode: 'tags-split',
      target: './src/api-client/',
      schemas: './src/api-client/model/',
      client: 'angular',
    },
  },
};
