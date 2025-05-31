import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Create Post
export const createPost = async (req, res) => {
    try {
        const { title, text, tags } = req.body
        const user = await User.findById(req.userId)

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))

            const newPostWithImage = new Post({
                authorAvatar: user.imgUrl,
                username: user.username,
                title,
                text,
                imgUrl: fileName,
                tags: tags ? tags.split(',') : [], 
                author: req.userId,
            })

            await newPostWithImage.save()
            await User.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithImage },
            })

            return res.json(newPostWithImage)
        }

        const newPostWithoutImage = new Post({
            authorAvatar: user.imgUrl,
            username: user.username,
            title,
            text,
            imgUrl: '',
            tags: tags ? tags.split(',') : [],
            author: req.userId,
        })
        await newPostWithoutImage.save()
        await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage },
        })
        res.json(newPostWithoutImage)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Get All Posts
// Контроллер для получения всех постов
export const getAll = async (req, res) => {
    try {
        const { searchQuery, page = 1 } = req.query;
        const limit = 7; // Количество постов на странице
        const skip = (page - 1) * limit;

        const query = searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } : {};

        const posts = await Post.find(query).sort('-createdAt').skip(skip).limit(limit);
        const popularPosts = await Post.find().limit(5).sort('-likes');
        const totalPostsCount = await Post.countDocuments(query); // Общее количество постов

        if (!posts) {
            return res.json({ message: 'Постов нет' });
        }

        res.json({ posts, popularPosts, totalPostsCount });
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' });
    }
};


// Get Post By Id
export const getById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
        })
        res.json(post)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Get All Posts
export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const list = await Promise.all(
            user.posts.map((post) => {
                return Post.findById(post._id)
            }),
        )

        res.json(list)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Remove post
export const removePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
        if (!post) return res.json({ message: 'Такого поста не существует' })

        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id },
        })

        res.json({ message: 'Пост был удален.' })
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

export const removePostFromAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ message: 'Пост не найден.' });
        }

        res.status(200).json({
            message: 'Пост успешно удалён.',
        });
    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ message: 'Ошибка при удалении Поста.' });
    }
};

export const getAllPostsNoParams = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt')

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'Нет постов.' });
        }

        console.log('Posts retrieved:', posts);  // Debugging log
        res.status(200).json({
            posts,
            message: 'Все посты успешно получены.',
        });
    } catch (error) {
        console.error('Error getting posts:', error.message);  // Log error for debugging
        res.status(500).json({ message: 'Ошибка при получении постов.' });
    }
};


// Update post
export const updatePost = async (req, res) => {
    try {
        const { title, text, tags, id } = req.body;
        const post = await Post.findById(id)

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
            post.imgUrl = fileName || ''
        }

        post.title = title
        post.text = text
        if (tags) {
            post.tags = tags.split(','); 
        }

        await post.save()

        res.json(post)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Get Post Comments
export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const list = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment)
            }),
        )
        res.json(list)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

// Like/Unlike Post
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' })
        }

        const userId = req.userId
        const isLiked = post.likes.includes(userId)

        if (isLiked) {
            // Убираем лайк
            post.likes = post.likes.filter((id) => id.toString() !== userId)
        } else {
            // Добавляем лайк
            post.likes.push(userId)
        }

        await post.save()
        res.json({ post, isLiked: !isLiked })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' })
    }
}

// Get Posts By Tag 
export const getPostsByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const { searchQuery, page = 1 } = req.query;

        const limit = 4; // Количество постов на странице
        const skip = (page - 1) * limit;

        const query = {
            tags: tag,
            ...(searchQuery && { title: { $regex: searchQuery, $options: 'i' } }), // фильтрация по поисковому запросу
        };

        const posts = await Post.find(query).sort('-createdAt').skip(skip).limit(limit);
        const totalPostsCount = await Post.countDocuments(query); // Общее количество постов с этим тегом

        if (!posts.length) {
            return res.json({ message: 'Посты с таким тегом и поисковым запросом не найдены' });
        }

        res.json({ posts, totalPostsCount });
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' });
    }
};


// Toggle Favorite Post
export const toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const postId = req.params.id;

        const isFavorited = user.favorites.includes(postId);

        if (isFavorited) {
            await User.findByIdAndUpdate(req.userId, {
                $pull: { favorites: postId },
            });
        } else {
            await User.findByIdAndUpdate(req.userId, {
                $push: { favorites: postId },
            });
        }

        const updatedUser = await User.findById(req.userId);
        const post = await Post.findById(postId);

        res.json({ post, favorites: updatedUser.favorites });
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' });
    }
};


// Get Favorite Posts
export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const favoritePosts = await Post.find({ _id: { $in: user.favorites } }).sort('-createdAt');

        if (!favoritePosts.length) {
            return res.json({ message: 'У вас нет избранных постов.' });
        }

        res.json(favoritePosts);
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' });
    }
};
