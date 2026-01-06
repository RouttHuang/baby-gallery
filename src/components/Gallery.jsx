import React, { useState, useEffect, useRef } from 'react'
import lightGallery from 'lightgallery';
import 'lightgallery/css/lightgallery.css';

const Gallery = () => {
  // 从localStorage获取照片，如果没有则使用默认值
  const getPhotosFromStorage = () => {
    const storedPhotos = localStorage.getItem('photos');
    if (storedPhotos) {
      return JSON.parse(storedPhotos);
    }
    // 默认照片
    return [
      { id: 1, url: 'https://picsum.photos/id/237/800/600', title: '示例照片1', likes: 128, comments: [] },
      { id: 2, url: 'https://picsum.photos/id/238/800/1000', title: '示例照片2', likes: 96, comments: [] },
      { id: 3, url: 'https://picsum.photos/id/239/800/500', title: '示例照片3', likes: 156, comments: [] },
      { id: 4, url: 'https://picsum.photos/id/240/800/800', title: '示例照片4', likes: 89, comments: [] },
    ];
  };
  
  const [photos, setPhotos] = useState(getPhotosFromStorage());
  const [selectedFile, setSelectedFile] = useState(null);
  const [newComment, setNewComment] = useState({ photoId: null, text: '' });
  const galleryRef = useRef(null);
  const lgInstance = useRef(null);

  // 保存照片到localStorage
  const savePhotosToStorage = (newPhotos) => {
    setPhotos(newPhotos);
    localStorage.setItem('photos', JSON.stringify(newPhotos));
  };

  // 初始化和销毁lightGallery实例
  useEffect(() => {
    if (galleryRef.current) {
      // 初始化lightGallery
      lgInstance.current = lightGallery(galleryRef.current, {
        speed: 500,
        thumbnail: true
      });
    }

    // 组件卸载时销毁实例
    return () => {
      if (lgInstance.current) {
        lgInstance.current.destroy();
      }
    };
  }, [photos]);

  // 处理照片上传
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file, index) => ({
      id: photos.length + index + 1,
      url: URL.createObjectURL(file),
      title: file.name,
      likes: 0,
      comments: []
    }));
    savePhotosToStorage([...newPhotos, ...photos]);
  };

  // 处理点赞功能
  const handleLike = (id) => {
    const updatedPhotos = photos.map(photo => {
      if (photo.id === id) {
        return { ...photo, likes: photo.likes + 1 };
      }
      return photo;
    });
    savePhotosToStorage(updatedPhotos);
  };

  // 处理评论提交
  const handleCommentSubmit = (photoId) => {
    if (!newComment.text.trim()) return;
    
    const updatedPhotos = photos.map(photo => {
      if (photo.id === photoId) {
        const newCommentObj = {
          id: Date.now(),
          text: newComment.text,
          name: '访客',
          date: new Date().toLocaleDateString()
        };
        return { 
          ...photo, 
          comments: [...photo.comments, newCommentObj] 
        };
      }
      return photo;
    });
    
    savePhotosToStorage(updatedPhotos);
    setNewComment({ photoId: null, text: '' });
  };

  return (
    <section id="gallery" className="py-20 px-4 bg-soft">
      <div className="container mx-auto max-w-6xl animate-slide-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            <i className="fa fa-photo text-primary mr-2"></i>
            宝宝相册
          </h2>
          <p className="text-gray-600">记录宝宝的精彩瞬间</p>
        </div>
        
        {/* 照片上传按钮 */}
        <div className="mb-8 text-center">
          <label htmlFor="photoUpload" className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full transition-all-300 transform hover:scale-105 active:scale-95 cursor-pointer inline-block">
            <i className="fa fa-upload mr-2"></i>选择本地照片
            <input type="file" id="photoUpload" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          </label>
          <p className="text-sm text-gray-500 mt-2">从本地目录选择照片</p>
        </div>
        
        {/* 相册网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="photoGallery" ref={galleryRef}>
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all-300 transform hover:-translate-y-1 group"
            >
              <a 
                href={photo.url} 
                className="relative block overflow-hidden"
                data-lg-size={`800-600`}
              >
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <i className="fa fa-search-plus text-white text-3xl"></i>
                </div>
              </a>
              
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 mb-2 truncate">{photo.title}</h3>
                
                {/* 点赞和评论 */}
                <div className="flex items-center justify-between text-sm mb-3">
                  <button 
                    className="flex items-center text-gray-600 hover:text-primary transition-colors"
                    onClick={() => handleLike(photo.id)}
                  >
                    <i className="fa fa-heart mr-1"></i>
                    <span>{photo.likes}</span>
                  </button>
                  
                  <span className="text-gray-600">
                    <i className="fa fa-comment-o mr-1"></i>
                    <span>{photo.comments.length}</span>
                  </span>
                </div>
                
                {/* 评论列表 */}
                <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
                  {photo.comments.map((comment) => (
                    <div key={comment.id} className="text-xs bg-gray-100 p-2 rounded">
                      <p className="font-medium">{comment.name} <span className="text-gray-500">{comment.date}</span></p>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
                
                {/* 评论框 */}
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="写下你的评论..." 
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={newComment.photoId === photo.id ? newComment.text : ''}
                    onChange={(e) => setNewComment({ photoId: photo.id, text: e.target.value })}
                  />
                  <button 
                    className="bg-primary text-white px-3 py-2 rounded-r-lg hover:bg-primary/90 transition-colors"
                    onClick={() => handleCommentSubmit(photo.id)}
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery