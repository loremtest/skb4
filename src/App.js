import bunyan from 'bunyan';
import express from 'express';
import mongoose from 'mongoose';
import getMiddlewares from './middlewares';
import getModels from './models';
import getResourses from './resourses';
import getApi from './api';

export default class App {
  constructor(params = {}) {
    Object.assign(this, params);
    if (!this.log) this.log = App.getLogger();
    this.init();
  }
  init() {
    this.log.trace('App init');

    this.app = express();
    this.db = this.getDatabase();
    this.middlewares = this.getMiddlewares();
    this.models = this.getModels();
    this.resourses = this.getResourses();
    this.log.trace('middlewares', Object.keys(this.middlewares));
    this.log.trace('models', Object.keys(this.models));
    this.log.trace('resourses', Object.keys(this.resourses));

    this.useMiddlewares();
    this.useRoutes();
    // this.app.use(this.middlewares.catchError);
    this.useDefaultRoute();
  }
  static getLogger(params) {
    return bunyan.createLogger(Object.assign({
      name: 'App',
      // eslint-disable-next-line no-undef
      src: __DEV__,
      level: 'trace',
    }, params));
  }
  getDatabase() {
    return {
      run: () => {
        new Promise((resolve) => {
          mongoose.connect(this.config.db.url, { useMongoClient: true });
          resolve();
        });
      },
    };
  }
  getMiddlewares() {
    return getMiddlewares(this);
  }
  getModels() {
    return getModels(this);
  }
  getResourses() {
    return getResourses(this);
  }
  useMiddlewares() {
    this.app.use(this.middlewares.reqLog);
    this.app.use(this.middlewares.accessLogger);
    this.app.use(this.middlewares.reqParser);
    this.app.use(this.resourses.Auth.parseToken);
    this.app.use(this.resourses.Auth.parseUser);
  }
  useRoutes() {
    const api = getApi(this);
    this.app.use('/api', api);
  }
  useDefaultRoute() {
    this.app.use((req, res, next) => {
      const err = ('Route not found');
      next(err);
    });
  }
  async run() {
    this.log.trace('App run');
    try {
      await this.db.run();
    } catch (err) {
      this.log.fatal(err);
    }
    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        this.log.info(`App "${this.config.name}" running on port ${this.config.port}!`);
        resolve(this);
      });
    });
  }
}
