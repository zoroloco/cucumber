// eslint-disable-next-line
export default {
  clientId: process.env.REACT_APP_CLIENTID,
  domain: process.env.REACT_APP_DOMAIN,
  resourceServer:
    process.env.NODE_ENV !== "production"
      ? `http://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`
      : `https://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`,
};
