module.exports = {
  development: {
    port: 3000,
    authSecret: 'loftschool',
    database: {
      host: 'localhost',
      name: 'test',
      username: 'postgres',
      port: 5432,
      password: '12345',
      ssl: false
    }
  },
  production: {
    port: 3000,
    authSecret: 'loftschool',
    database: {
      host: 'ec2-54-243-212-227.compute-1.amazonaws.com',
      name: 'd3baibcdftgkuo',
      username: 'gkuopqfenaxyls',
      port: 5432,
      password: '48d7aa153cb502bbb9cd392a4d22585a0ac3ebf072cda294a91d32dccaf5e9df',
      ssl: true
    }
  }
};
