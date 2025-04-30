import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fileUpload from 'express-fileupload'
import Post from '../models/Post.js';
import Comment from "../models/Comment.js" 

// Register user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username or email is already used
        const isUsernameUsed = await User.findOne({ username });
        if (isUsernameUsed) {
            return res.json({
                message: 'Данный username уже занят.',
            });
        }

        const isEmailUsed = await User.findOne({ email });
        if (isEmailUsed) {
            return res.json({
                message: 'Данный email уже занят.',
            });
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hash,
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        );

        // Save the user to the database
        await newUser.save();

        res.json({
            newUser,
            token,
            message: 'Регистрация прошла успешно.',
        });
    } catch (error) {
        console.log('Error creating user:', error.message);
        res.json({ message: 'Ошибка при создании пользователя.' });
    }
};

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Missing credentials' });
        }

        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ],
        });


        if (!user) {
            return res.status(404).json({
                message: 'Такого пользователя не существует.',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Неправильный пароль или почта.',
            });
        }
 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        return res.status(200).json({
            token,
            user,
            message: 'Вы вошли в систему.',
        });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ message: 'Ошибка при авторизации.' });
    }
};
// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'Такого пользователя не существует.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            user,
            token,
        })
    } catch (error) {
        res.json({ message: 'Нет доступа.' })
    }
}

// Get All Posts
export const getAllUsers = async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await User.find().sort('-createdAt')

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Нет пользователей.' });
        }

        res.status(200).json({
            users,
            message: 'Все пользователи успешно получены.',
        });
    } catch (error) {
        console.error('Error getting users:', error.message);
        res.status(500).json({ message: 'Ошибка при получении пользователей.' });
    }
};


export const removeUserFromAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        res.status(200).json({
            message: 'Пользователь успешно удалён.',
        });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ message: 'Ошибка при удалении пользователя.' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { avatar } = req.files || {};  // Get the avatar file if present
        const { username } = req.body || {};  // Get the new username from body

        const { userId } = req;

        // If neither avatar nor username is provided, return error
        if (!avatar && !username) {
            return res.status(400).json({ message: 'No avatar or username provided' });
        }

        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if username is already taken
        if (username && username !== user.username) {
            const isUsernameUsed = await User.findOne({ username });
            if (isUsernameUsed) {
                return res.status(400).json({ message: 'Данный username уже занят.' });
            }
        }

        // If avatar is provided, upload it and update the user's imgUrl
        if (avatar) {
            const avatarPath = `avatars/${Date.now()}-${avatar.name}`;
            await avatar.mv(`./uploads/${avatarPath}`);
            user.imgUrl = avatarPath;  // Update the avatar URL in the user's data
        }

        // If username is provided, update it
        if (username) {
            user.username = username;
        }

        await user.save();

        await Post.updateMany(
            { author: userId },  // Find all posts by this user
            {  
                $set: { 
                    authorAvatar: user.imgUrl || user.authorAvatar,  // Update avatar in posts
                    username: user.username  // Update username in posts
                }
            }
        );
        await Comment.updateMany(
            { author: userId },  // Find all comments by this user
            {  
                $set: { 
                    authorAvatar: user.imgUrl || user.authorAvatar,  // Update avatar in comments
                    username: user.username  // Update username in comments
                }
            }
        );

        res.json({ message: 'Avatar and/or username updated successfully', user });
    } catch (error) {
        console.error('Error updating avatar and username:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};



// Toggle Favorite  
export const toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const postId = req.params.id;
        const post = await Post.findById(postId); // Get the post by ID

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Toggle the favorite status
        if (user.favorites.includes(postId)) {
            user.favorites = user.favorites.filter(favoriteId => favoriteId.toString() !== postId.toString()); // Remove from favorites
        } else {
            user.favorites.push(postId); // Add to favorites
        }

        await user.save();

        res.status(200).json({
            message: 'Favorites updated',
            favorites: user.favorites, // Return updated favorites list
        });
    } catch (error) {
        console.error('Error toggling favorite:', error.message);
        res.status(500).json({ message: 'Error toggling favorite' });
    }
};



export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const favorites = user.favorites; 
        
        // Проверка на наличие imgUrl
        const validFavorites = favorites.filter(post => post.imgUrl); 

        res.status(200).json({ favorites: validFavorites });
    } catch (error) {
        console.error('Error getting favorites:', error.message);
        res.status(500).json({ message: 'Error retrieving favorites' });
    }
};
 