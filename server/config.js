module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'WORD',
  // OAuth 2.0
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'secret_here',
  MONGOUSER: 'crafted',
  MONGOPASS: 'test01',
  ENV: 'Test',
  //FAAS_BASE_URL: 'http://crafted.co',
  FAAS_BASE_URL: 'http://localhost:3000',
  FAAS_API_VERSION: 'v1',
  FAAS_API_URL: '/api',
  //DEFAULT_IMAGE_ID: '5835d6e0d2b0397f63e6e822'
  DEFAULT_IMAGE_ID: '5835d18c00e075001bed2d0c'
};