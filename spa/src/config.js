// eslint-disable-next-line
export default {
  clientId: process.env.REACT_APP_CLIENTID,
  domain: process.env.REACT_APP_DOMAIN,
  resourceServer: (process.env.NODE_ENV === 'production') ? 'https://druidia.net' : 'http://druidia.net:3001'
};
