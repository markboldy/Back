import faker from 'faker';
import { join } from 'path';

import User from '../../models/User';
import { deleteAllAvatars } from '../utils';
import { BASIC_CATEGORIES_NAMES, IMAGES_FOLDER_PATH } from '../constants';
import ExpenseCategory from '../../models/ExpenseCategory';

const seedUsers = async () => {
  await User.deleteMany({});
  await deleteAllAvatars(join(__dirname, '../../..', IMAGES_FOLDER_PATH));

  // create 3 users
  const usersPromises = Array.from({ length: 3 }).map(async (_, index) => {
    const user = await new User({
      provider: 'email',
      username: `user${index}`,
      email: `email${index}@email.com`,
      password: '123456789',
      name: faker.name.findName(),
      avatar: `avatar_placeholder.png`,
    });

    if (index === 0) {
      // @ts-ignore
      user.role = 'ADMIN';
    }

    return new Promise((resolve) => {
      // @ts-ignore
      user.registerUser(user, () => {
        // @ts-ignore
        resolve();
      });
    })
  });

  return Promise.all(usersPromises);
}

const seedExpenseCategories = async() => {
  const categoriesDocs = await ExpenseCategory.find();

  if (categoriesDocs.length > 0) {
    return Promise.resolve()
  }

  return Promise.all(
    BASIC_CATEGORIES_NAMES.map(name => {
      return new ExpenseCategory({
        name
      }).save();
    })
  )
}

export const seedDb = async () => {
  console.log('Seeding database...');

  try {
    await seedUsers();
    await seedExpenseCategories();

    console.log('Seeds applied');
  } catch(error) {
    console.error('Seeding failed', { error });
  }
};
