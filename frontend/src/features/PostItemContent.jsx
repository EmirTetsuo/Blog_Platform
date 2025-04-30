import React, { useState, useRef, useEffect } from 'react';
import { FaVolumeUp, FaVolumeMute, FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export const PostItemContent = ({ post }) => {
    const user = useSelector((state) => state.auth.user);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [userWantsToPlay, setUserWantsToPlay] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;
    const [isEnded, setIsEnded] = useState(false);

    const videoRef = useRef(null);

    const togglePlayPause = () => {
        if (!userWantsToPlay) {
            setUserWantsToPlay(true);
        } else {
            setUserWantsToPlay(false);
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleReplay = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
            setIsEnded(false);
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    const isVideo = (url) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg'];
        return videoExtensions.some((ext) => url.endsWith(ext));
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;
    
        const handleVisibilityChange = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (userWantsToPlay) {
                        videoElement.play();
                        setIsPlaying(true);
                    }
                } else {
                    videoElement.pause();
                    setIsPlaying(false);
                }
            });
        };
    
        const observer = new IntersectionObserver(handleVisibilityChange, {
            threshold: 0.5,
        });
    
        observer.observe(videoElement);
    
        // 🟡 ПРОВЕРКА: видно ли сейчас (в первый момент)
        const rect = videoElement.getBoundingClientRect();
        const isVisibleNow =
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
        
        if (isVisibleNow && userWantsToPlay) {
            videoElement.play();
            setIsPlaying(true);
        }
    
        return () => {
            observer.unobserve(videoElement);
        };
    }, [userWantsToPlay]);
    
    return (
        <div className={`${post.imgUrl && isVideo(post.imgUrl)} transition-all`}>
            {post.imgUrl && isVideo(post.imgUrl) ? (
                <div className="relative group">
                    <video
                        ref={videoRef}
                        width="100%"
                        height="100%"
                        muted={isMuted}
                        onEnded={() => {
                            setIsPlaying(false);
                            setIsEnded(true);
                        }}
                        className="object-cover w-full max-md:max-h-[250px] max-h-[500px]"
                    >
                        <source src={`${API_URL}/${post.imgUrl}`} type="video/mp4" />
                        Ваш браузер не поддерживает видео.
                    </video>

                    {(isEnded || !isPlaying) && (
                        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 group-hover:flex">
                            <button
                                onClick={isEnded ? handleReplay : togglePlayPause}
                                className="text-white opacity-70 hover:opacity-100 transition"
                            >
                                {isEnded ? (
                                    <FaRedo className="max-md:w-8 max-md:h-8 w-20 h-20" />
                                ) : isPlaying ? (
                                    <FaPause className="max-md:w-8 max-md:h-8 w-20 h-20" />
                                ) : (
                                    <FaPlay className="max-md:w-8 max-md:h-8 w-20 h-20" />
                                )}
                            </button>
                        </div>
                    )}

                    <button
                        onClick={toggleMute}
                        className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white"
                    >
                        {isMuted ? (
                            <FaVolumeMute className="w-6 h-6" />
                        ) : (
                            <FaVolumeUp className="w-6 h-6" />
                        )}
                    </button>
                </div>
            ) : (
                <img
                    src={`${API_URL}/${post.imgUrl}`}
                    alt="Post content"
                    className="object-cover w-full h-full max-md:max-h-[250px] max-h-[500px]"
                />
            )}
        </div>
    );
};
