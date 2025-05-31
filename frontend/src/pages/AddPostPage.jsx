import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createPost, selectAvailableTags, getAllPosts } from '../shared/slices/post/postSlice'
import { toast } from 'react-toastify';
import { Upload, Trash2, PlusCircle, Tags } from 'lucide-react'

export const AddPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [image, setImage] = useState('')
    const [selectedTags, setSelectedTags] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(false)
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

        if (loading) return 
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
            setLoading(true)
            const data = new FormData()
            data.append('title', title)
            data.append('text', text)
            data.append('media', image)
            data.append('tags', selectedTags.join(','))

            await dispatch(createPost(data))
            toast.success('Пост успешно создан!');

            const searchQuery = ''
            const page = 1
            dispatch(getAllPosts({ searchQuery, page }))

            navigate('/')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
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
            className="max-w-2xl mx-auto py-10 px-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700"
            onSubmit={submitHandler}
            >
            <h2 className="text-3xl font-bold text-white text-center mb-8">Создать новый пост</h2>

            <label className="block mb-6">
                <span className="text-gray-300 text-sm font-semibold mb-2 block">Медиафайл:</span>
                <div className="relative cursor-pointer group">
                <input type="file" className="hidden" onChange={handleFileChange} />
                <div className="flex items-center justify-center gap-2 py-4 bg-gray-800 border border-gray-600 rounded-xl group-hover:bg-gray-700 transition">
                    <Upload className="text-blue-400" />
                    <span className="text-gray-300 text-sm">Нажмите, чтобы загрузить файл</span>
                </div>
                </div>
            </label>

            {image && (
                <div className="flex justify-center py-4">
                {isVideo(image.name) ? (
                    <video controls className="rounded-xl w-48 h-48 object-cover shadow-lg">
                    <source src={URL.createObjectURL(image)} type="video/mp4" />
                    Ваш браузер не поддерживает видео.
                    </video>
                ) : (
                    <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    className="rounded-xl w-48 h-48 object-cover shadow-lg"
                    />
                )}
                </div>
            )}

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

            <label className="block mb-6 relative" ref={dropdownRef}>
                <span className="text-gray-300 text-sm font-semibold flex items-center gap-1">
                <Tags size={16} />
                Теги:
                </span>
                <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="mt-2 w-full rounded-lg bg-gray-800 text-white py-3 px-4 border border-gray-600 text-left focus:ring-2 focus:ring-blue-500 transition"
                >
                {selectedTags.length > 0 ? `Выбрано: ${selectedTags.length}` : 'Выберите теги'}
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
                            onChange={handleTagChange}
                            className="accent-blue-500"
                        />
                        {tag}
                        </label>
                    ))}
                    </div>
                </div>
                )}
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
                >
                <PlusCircle size={16} /> Создать пост
                </button>
            </div>
        </form>
    )
}
