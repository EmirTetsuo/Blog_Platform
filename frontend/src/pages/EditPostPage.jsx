import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updatePost, selectAvailableTags, getAllPosts } from '../shared/slices/post/postSlice'
import axios from '../shared/api/axios'
import { toast } from 'react-toastify';
import { Upload, Trash2, PlusCircle, Tags } from 'lucide-react'

export const EditPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [oldImage, setOldImage] = useState('')
    const [newImage, setNewImage] = useState('')
    const [selectedTags, setSelectedTags] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const API_URL = process.env.REACT_APP_API_URL;

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const availableTags = useSelector(selectAvailableTags)
 
    const fetchPost = useCallback(async () => {
        const { data } = await axios.get(`/posts/${params.id}`)
        setTitle(data.title)
        setText(data.text)
        setOldImage(data.imgUrl)
        setSelectedTags(Array.isArray(data.tags) ? data.tags : data.tags?.split(',') || [])
    }, [params.id])

    const handleTagChange = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag))
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    }

    const submitHandler = async () => {
        if (!title.trim()) {
            toast.error('Заголовок обязателен для заполнения');
            return;
        }
        if (!text.trim()) {
            toast.error('Текст поста обязателен для заполнения');
            return;
        }
        // Для картинки: если нет нового изображения и нет старого — тоже ошибка
        if (!newImage && !oldImage) {
            toast.error('Пожалуйста, добавьте изображение');
            return;
        }
        try {
            const updatedPost = new FormData()
            updatedPost.append('title', title)
            updatedPost.append('text', text)
            updatedPost.append('id', params.id)
            updatedPost.append('image', newImage)
            updatedPost.append('tags', selectedTags.join(','))
            await dispatch(updatePost(updatedPost))
            toast.success('Пост успешно редактирован!');
            const searchQuery = ''
            const page = 1
            dispatch(getAllPosts({ searchQuery, page }))
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setTitle('')
        setText('')
        setSelectedTags([])
    }

    const isVideo = (filename) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg']
        return videoExtensions.some((ext) => filename.endsWith(ext))
    }

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    return (
        <form
            className="max-w-xl mx-auto py-8 px-10 bg-gray-800 rounded-lg shadow-lg"
            onSubmit={(e) => e.preventDefault()}
        >
            <h2 className="text-2xl text-white font-semibold text-center mb-6">Редактировать пост</h2>

            <label className="block mb-6">
                <span className="text-gray-300 text-sm font-semibold mb-2 block">Медиафайл:</span>
                <div className="relative cursor-pointer group">
                <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                        setNewImage(e.target.files[0])
                        setOldImage('')
                    }}
                />
                <div className="flex items-center justify-center gap-2 py-4 bg-gray-800 border border-gray-600 rounded-xl group-hover:bg-gray-700 transition">
                    <Upload className="text-blue-400" />
                    <span className="text-gray-300 text-sm">Нажмите, чтобы загрузить файл</span>
                </div>
                </div>
            </label>

            <div className="flex justify-center py-2">
                {oldImage && (
                    isVideo(oldImage) ? (
                        <video
                            width="100%"
                            height="auto"
                            controls
                            className="rounded-xl w-32 h-32 object-cover shadow-lg"
                        >
                            <source src={`${API_URL}/${oldImage}`} type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                        </video>
                    ) : (
                        <img
                            src={`${API_URL}/${oldImage}`}
                            alt={oldImage}
                            className="rounded-xl w-32 h-32 object-cover shadow-lg"
                        />
                    )
                )}
                {newImage && (
                    isVideo(newImage.name) ? (
                        <video
                            width="100%"
                            height="auto"
                            controls
                            className="rounded-xl w-32 h-32 object-cover shadow-lg"
                        >
                            <source src={URL.createObjectURL(newImage)} type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                        </video>
                    ) : (
                        <img
                            src={URL.createObjectURL(newImage)}
                            alt={newImage.name}
                            className="rounded-xl w-32 h-32 object-cover shadow-lg"
                        />
                    )
                )}
            </div>

            <label className="block mb-6">
                <span className="text-gray-300 text-sm font-semibold">Заголовок поста:</span>
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите заголовок"
                className="mt-2 w-full rounded-lg bg-gray-800 text-white py-3 px-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
            </label>

            <label className="block text-sm text-gray-200 opacity-80 mt-4">
                <Tags size={16} />
                Теги:
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="mt-2 w-full rounded-lg bg-gray-800 text-white py-3 px-4 border border-gray-600 text-left focus:ring-2 focus:ring-blue-500 transition"
                    >
                        {selectedTags.length > 0
                            ? `${selectedTags.length} тег(ов) выбрано`
                            : 'Выберите теги'}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute mt-2 w-full bg-gray-900 border border-gray-600 rounded-xl shadow-lg z-30">
                            <div className="max-h-60 overflow-y-auto p-2">
                                {availableTags.map((tag) => (
                                    <label key={tag} className="flex items-center gap-2 text-gray-200 text-sm px-2 py-1 hover:bg-gray-800 rounded">
                                        <input
                                            type="checkbox"
                                            value={tag}
                                            checked={selectedTags.includes(tag)}
                                            onChange={() => handleTagChange(tag)}
                                            className="accent-blue-500"
                                        />
                                        {tag}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </label>

            <label className="block mb-6">
                <span className="text-gray-300 text-sm font-semibold">Содержимое:</span>
                <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите содержимое поста"
                className="mt-2 w-full rounded-lg bg-gray-800 text-white py-3 px-4 border border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                />
            </label>

            <div className="flex justify-between items-center mt-6">
                <button
                    type="button"
                    onClick={clearFormHandler}
                    className="flex items-center gap-2 px-5 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
                    >
                    <Trash2 size={16} /> Очистить
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition"
                    onClick={submitHandler}
                    >
                    <PlusCircle size={16} /> Обновить
                </button>
            </div>
        </form>
    )
}
