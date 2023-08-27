import User, { hashPassword, validateUserUpdateBody } from '../models/User';
import { DEFAULT_AVATAR_NAME } from '../utils/constants';
import { sanitizeObject } from '../utils/utils';
import requireJwtAuth from '../middleware/requireJwtAuth';
import { unlinkAvatar, upload } from '../services/upload';

export const getAllUsers = [requireJwtAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 'desc' });

    res.status(200).json({
      users: users.map((userDoc) => {
        return userDoc.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}];

export const getAuthUser = [requireJwtAuth, (req, res) => {
  const user = req.user.toJSON();
  res.json({ user });
}];

export const getUserByUserName = [requireJwtAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'No user found.' });
    res.json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}];



export const updateUser = [requireJwtAuth, upload.single('avatar'), async (req, res) => {
  try {
    const { user, body, params, file } = req;
    const tempUser = await User.findById(params.id);

    if (!tempUser) {
      return res.status(404).json({ message: 'No such user.' });
    }

    if (!(tempUser.id === user.id || user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privileges to edit this user.' });
    }

    //validate name, username and password
    const { error } = validateUserUpdateBody(body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // if fb or google user provider don't update password
    let password = null;
    if (user.provider === 'email' && body.password && body.password !== '') {
      password = await hashPassword(body.password);
    }

    if (body.username) {
      const existingUser = await User.findOne({ username: body.username });

      if (existingUser && existingUser.id !== tempUser.id) {
        return res.status(400).json({ message: 'Username already taken.' });
      }
    }

    const updatedUserPart = {
      avatar: file ? file.filename : null,
      name: body.name ?? null,
      username: body.username ?? null,
      password
    };

    // remove existing avatar if new presented
    if (updatedUserPart.avatar && user.avatar !== DEFAULT_AVATAR_NAME) {
      await unlinkAvatar(user.avatar);
    }

    // remove '', null, undefined and update db
    const updatedUser = await User.findByIdAndUpdate(tempUser.id, { $set: sanitizeObject(updatedUserPart) }, { new: true });

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: 'Bad request.' });
  }
}]

export const deleteUser = [requireJwtAuth, async (req, res) => {
  try {
    const tempUser = await User.findById(req.params.id);

    if (!tempUser) {
      return res.status(404).json({ message: 'No such user.' });
    }

    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'You do not have privilegies to delete that user.' });
    }

    //delete user
    const user = await User.findByIdAndRemove(tempUser.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}];
