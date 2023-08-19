import faker from 'faker';
import { join } from 'path';

import User from '../../models/User';
import { deleteAllAvatars } from '../utils';
import { IMAGES_FOLDER_PATH } from '../constants';

export const seedDb = async () => {
  console.log('Seeding database...');

  try {
    await User.deleteMany({});
    await deleteAllAvatars(join(__dirname, '../..', IMAGES_FOLDER_PATH));

    // create 3 users
    const usersPromises = [...Array(3).keys()].map((index, i) => {
      const user = new User({
        provider: 'email',
        username: `user${index}`,
        email: `email${index}@email.com`,
        password: '123456789',
        name: faker.name.findName(),
        // avatar: faker.image.avatar(),
        avatar: `avatar${index}.jpg`,
        bio: faker.lorem.sentences(3),
      });

      if (index === 0) {
        user.role = 'ADMIN';
      }
      user.registerUser(user, () => {});

      return user;
    });

    await Promise.all(
      usersPromises.map(async (user) => {
        await user.save();
      }),
    );

    console.log('Seeds applied');
  } catch(error) {
    console.error('Seeding failed', { error });
  }
};
