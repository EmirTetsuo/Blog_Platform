import Comment from '../models/Comment.js'
import Post from '../models/Post.js'
import User from '../models/User.js';

export const createComment = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const user = await User.findById(req.userId)

        if (!comment)
            return res.json({ message: 'Комментарий не может быть пустым' });

        const newComment = new Comment({
            comment,
            authorAvatar: user.imgUrl, 
            username: user.username,
            author: req.userId,
        }); 
 
        await newComment.save();

        try {
            await Post.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
            });
        } catch (error) {
            console.log(error);
        }

        res.json(newComment);
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' });
    }
};


// Get All Comments
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().sort('-createdAt').populate('author', 'username');
        res.json(comments) 
    } catch (error) {
        console.log(error)
        res.json({ message: 'Ошибка при получении комментариев.' })
    }
}


// Remove Comment
export const removeCommentFromAdmin = async (req, res) => {
    try {
        const { id } = req.params

        const comment = await Comment.findByIdAndDelete(id)
        if (!comment)
            return res.json({ message: 'Комментарий не найден.' })

        await Post.updateMany(
            { comments: id },
            { $pull: { comments: id } }
        )

        res.json({ message: 'Комментарий был удалён.' })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Ошибка при удалении комментария.' })
    }
}