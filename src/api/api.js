import { AsyncRouter } from 'express-async-router';
import getAuth from './auth';

export default (ctx) => {
  const api = AsyncRouter();

  api.all('/', () => ({ ok: true, version: '1.0.1' }));
  api.use('/auth', getAuth(ctx));

  // api.use('/aboutMe', (req) => {
  //   return req.user
  // });

  api.all('/test', () => ({ test: 123123 }));
  api.all('/error', () => {
    throw new Error('asdasdasd');
  });
  api.all('/timeout', (req, res) => new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        some: 123,
      });
    }, 2000);
  }));

  return api;
};
