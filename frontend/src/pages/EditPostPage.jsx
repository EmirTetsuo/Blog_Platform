import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updatePost, selectAvailableTags, getAllPosts } from '../shared/slices/post/postSlice'
import axios from '../shared/api/axios'
import { toast } from 'react-toastify';

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
        setSelectedTags(data.tags ? data.tags.split(',') : [])
    }, [params.id])

    const handleTagChange = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag))
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    }

    const submitHandler = async () => {
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

            <label className="block text-sm text-gray-300 font-medium mb-4">
                Прикрепить файл:
                <div className="relative">
                    <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            setNewImage(e.target.files[0])
                            setOldImage('')
                        }}
                    />
                    <div className="flex items-center justify-center py-6 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                        <span className="max-md:text-sm text-gray-400 text-lg">Нажмите, чтобы загрузить файл</span>
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
                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                        >
                            <source src={`${API_URL}/${oldImage}`} type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                        </video>
                    ) : (
                        <img
                            src={`${API_URL}/${oldImage}`}
                            alt={oldImage}
                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                        />
                    )
                )}
                {newImage && (
                    isVideo(newImage.name) ? (
                        <video
                            width="100%"
                            height="auto"
                            controls
                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                        >
                            <source src={URL.createObjectURL(newImage)} type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                        </video>
                    ) : (
                        <img
                            src={URL.createObjectURL(newImage)}
                            alt={newImage.name}
                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                        />
                    )
                )}
            </div>

            <label className="block text-sm text-gray-200 opacity-80 mt-4">
                Заголовок поста:
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите заголовок"
                    className="mt-2 text-black w-full rounded-lg bg-gray-400 py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700 transition"
                />
            </label>

            <label className="block text-sm text-gray-200 opacity-80 mt-4">
                Теги:
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="text-black w-full rounded-lg bg-gray-400 py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700 transition"
                    >
                        {selectedTags.length > 0
                            ? `${selectedTags.length} тег(ов) выбрано`
                            : 'Выберите теги'}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute opacity-100 mt-2 w-full p-2 bg-black border-2 border-gray-500 rounded-lg shadow-lg z-20">
                            <div className="max-h-60 opacity-100 overflow-y-auto py-2">
                                {availableTags.map((tag) => (
                                    <label key={tag} className="block text-gray-200 text-sm">
                                        <input
                                            type="checkbox"
                                            value={tag}
                                            checked={selectedTags.includes(tag)}
                                            onChange={() => handleTagChange(tag)}
                                            className="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                        {tag}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </label>

            <label className="block text-sm text-gray-200 mt-4">
                Текст поста:
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Введите текст поста"
                    className="mt-2 text-black w-full rounded-lg bg-gray-400 py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700 transition"
                />
            </label>

            <div className="flex justify-between items-center mt-6">
                <button
                    type="button"
                    onClick={clearFormHandler}
                    className="max-md:text-sm px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    Очистить
                </button>
                <button
                    type="submit"
                    onClick={submitHandler}
                    className="max-md:text-sm px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Обновить
                </button>
            </div>
        </form>
    )
}
