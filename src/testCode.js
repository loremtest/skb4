import bunyan from 'bunyan';
import mongoose from 'mongoose';

import config from './config';
import getUserModel from './models/User';

const log = bunyan.createLogger({
  name: 'test',
  src: true,
  level: 'trace',
});

const User = getUserModel({ log, config });


(async (password) => {
  await mongoose.connect(config.db.url, { useMongoClient: true });

  const user = await User.findOne({});

  if (!user) return log.error('Такой пользователь не найден');

  let res = await user.verifyPassword(password);
  if (!res) {
    return log.error('Переданный пароль не подходит');
  }
  log.info('user:', await user.getIdentity());
  // console.log(user);
  return true;
})('passw3');
