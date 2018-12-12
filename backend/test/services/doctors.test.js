const app = require('../../src/app');

describe('\'doctors\' service', () => {
  it('registered the service', () => {
    const service = app.service('doctors');
    expect(service).toBeTruthy();
  });
});
