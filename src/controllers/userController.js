import User from '../models/userModel.js';

// @desc Update user profile
// @route PUT /api/user/profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();
    res.json({ message: 'Profile updated successfully', updatedUser });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc Set or Update PIN
// @route PUT /api/user/set-pin
const setPin = async (req, res) => {
  const { pin } = req.body;
  const user = await User.findById(req.user.id);

  if (user) {
    user.pin = pin;
    await user.save();
    res.json({ message: 'PIN updated successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc Get user transaction history
// @route GET /api/user/transactions
const getUserTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('transactions');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
export { updateProfile, setPin, getUserTransactions, getUserProfile };

