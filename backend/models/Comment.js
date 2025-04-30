import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        username: { type: String },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        authorAvatar: { type: String, default: '' },
    },
    { timestamps: true },
)
export default mongoose.model('Comment', CommentSchema)
 