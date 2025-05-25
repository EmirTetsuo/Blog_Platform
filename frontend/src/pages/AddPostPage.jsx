import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createPost, selectAvailableTags, getAllPosts } from '../shared/slices/post/postSlice'
import { toast } from 'react-toastify';

export const AddPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [image, setImage] = useState('')
    const [selectedTags, setSelectedTags] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const availableTags = useSelector(selectAvailableTags)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleTagChange = (e) => {
        const value = e.target.value
        if (selectedTags.includes(value)) {
            setSelectedTags(selectedTags.filter(tag => tag !== value))
        } else {
            setSelectedTags([...selectedTags, value])
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        if (!title.trim()) {
            toast.error('Пожалуйста, введите заголовок поста')
            return
        }
        if (!text.trim()) {
            toast.error('Пожалуйста, введите содержимое поста')
            return
        }
        if (!image) {
            toast.error('Пожалуйста, загрузите файл (картинку или видео)')
            return
        }

        try {
            const data = new FormData()
            data.append('title', title)
            data.append('text', text)
            data.append('image', image)
            data.append('tags', selectedTags.join(','))

            await dispatch(createPost(data))
            toast.success('Пост успешно создан!');

            const searchQuery = ''
            const page = 1
            dispatch(getAllPosts({ searchQuery, page }))

            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setText('')
        setTitle('')
        setImage('')
        setSelectedTags([])
    }

    const isVideo = (url) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg']
        return videoExtensions.some((ext) => url.endsWith(ext))
    }

    const isImage = (url) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', 'webp']
        return imageExtensions.some((ext) => url.endsWith(ext))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const fileName = file.name.toLowerCase()
            if (isImage(fileName)) {
                setImage(file)
            } else if (isVideo(fileName)) {
                setImage(file)
            } else {
                alert('Please upload an image or video file.')
                setImage('')
            }
        }
    }

    return (
        <form
            className="max-w-xl mx-auto py-8 px-10 bg-gray-800 rounded-lg shadow-lg"
            onSubmit={submitHandler}
        >
            <h2 className="text-2xl text-white font-semibold text-center mb-6">
                Создать новый пост
            </h2>

            <label className="block text-sm text-gray-300 font-medium max-md:mb-2 mb-4">
                Прикрепить файл:
                <div className="relative">
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <div className="flex items-center justify-center py-6 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                        <span className="max-md:text-sm text-gray-400 text-lg">
                            Нажмите, чтобы загрузить файл
                        </span>
                    </div>
                </div>
            </label>

            <div className="flex justify-center py-2">
                {image && (
                    isVideo(image.name) ? (
                        <video
                            width="100%"
                            height="auto"
                            controls
                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                        >
                            <source src={URL.createObjectURL(image)} type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                        </video>
                    ) : (
                        <img
                            src={URL.createObjectURL(image)}
                            alt={image.name}
                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                        />
                    )
                )}
            </div>

            <label className="block text-sm text-gray-200 opacity-80">
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
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="text-black w-full rounded-lg bg-gray-400 py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700 transition"
                    >
                        {selectedTags.length > 0
                            ? `Выбрано тегов: ${selectedTags.length}`
                            : 'Выберите теги'}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute opacity-100 mt-2 w-full p-2 bg-black border-2 border-gray-500 rounded-lg shadow-lg z-20">
                            <div className="max-h-60 overflow-y-auto py-2">
                                {availableTags.map((tag) => (
                                    <label key={tag} className="block text-gray-200 text-sm">
                                        <input
                                            type="checkbox"
                                            value={tag}
                                            checked={selectedTags.includes(tag)}
                                            onChange={handleTagChange}
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
                Содержимое:
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Введите содержимое поста"
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
                    className="max-md:text-sm px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Создать пост
                </button>
            </div>
        </form>
    )
}
