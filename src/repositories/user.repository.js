import User from '../models/user.model.js';

class UserRepository {
    async findAll(filter = {}) {
    return User.find(filter)
        .select('-password -__v')
        .sort({ createdAt: -1 });
    }

    async findById(id) {
    return User.findById(id).select('-password -__v');
    }

    async findRawById(id) {
    return User.findById(id);
    }

    async findByEmail(email) {
    return User.findOne({ email: email?.toLowerCase().trim() });
    }

    async create(userData) {
    const user = await User.create(userData);
    return User.findById(user._id).select('-password -__v');
    }

    async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select(
        '-password -__v'
    );
    }

    async deleteById(id) {
    return User.findByIdAndDelete(id).select('-password -__v');
    }
}

export default UserRepository;