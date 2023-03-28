// eslint-disable-next-line
export default {
  clientId: process.env.REACT_APP_CLIENTID,
  domain: process.env.REACT_APP_DOMAIN,
  resourceServer: `http://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`
};
