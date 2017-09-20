global.__DEV__ = true;
// __STAGE__
global.__PROD__ = false;

export default {
  name: 'Your super app',
  port: 3000,
  db: {
    url: 'mongodb://local.dev/skb4',
  },
  jwt: {
    secret: 'YOUR_SECRET@GSD#SDSDGSEG##%#^#^',
  },
};
