import React, { useState } from 'react'

const Videos = () => {
  // 从localStorage获取视频，如果没有则使用默认值
  const getVideosFromStorage = () => {
    const storedVideos = localStorage.getItem('videos');
    if (storedVideos) {
      return JSON.parse(storedVideos);
    }
    // 默认视频
    return [
      {
        id: 1,
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnail: 'https://picsum.photos/id/237/800/450',
        title: '宝宝第一次洗澡',
        date: '2024-01-15',
        likes: 128,
        comments: []
      },
      {
        id: 2,
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnail: 'https://picsum.photos/id/238/800/450',
        title: '宝宝第一次翻身',
        date: '2024-03-20',
        likes: 96,
        comments: []
      },
    ];
  };
  
  const [videos, setVideos] = useState(getVideosFromStorage());
  const [newComment, setNewComment] = useState({ videoId: null, text: '' });

  // 保存视频到localStorage
  const saveVideosToStorage = (newVideos) => {
    setVideos(newVideos);
    localStorage.setItem('videos', JSON.stringify(newVideos));
  };

  // 处理视频上传
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map((file, index) => ({
      id: videos.length + index + 1,
      url: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      title: file.name,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: []
    }));
    saveVideosToStorage([...newVideos, ...videos]);
  };

  // 处理点赞功能
  const handleLike = (id) => {
    const updatedVideos = videos.map(video => {
      if (video.id === id) {
        return { ...video, likes: video.likes + 1 };
      }
      return video;
    });
    saveVideosToStorage(updatedVideos);
  };

  // 处理评论提交
  const handleCommentSubmit = (videoId) => {
    if (!newComment.text.trim()) return;
    
    const updatedVideos = videos.map(video => {
      if (video.id === videoId) {
        const newCommentObj = {
          id: Date.now(),
          text: newComment.text,
          name: '访客',
          date: new Date().toLocaleDateString()
        };
        return { 
          ...video, 
          comments: [...video.comments, newCommentObj] 
        };
      }
      return video;
    });
    
    saveVideosToStorage(updatedVideos);
    setNewComment({ videoId: null, text: '' });
  };

  return (
    <section id="videos" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl animate-slide-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            <i className="fa fa-video-camera text-primary mr-2"></i>
            宝宝视频集锦
          </h2>
          <p className="text-gray-600">捕捉宝宝的动态瞬间</p>
        </div>
        
        {/* 视频上传按钮 */}
        <div className="mb-8 text-center">
          <label htmlFor="videoUpload" className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full transition-all-300 transform hover:scale-105 active:scale-95 cursor-pointer inline-block">
            <i className="fa fa-upload mr-2"></i>选择本地视频
            <input type="file" id="videoUpload" accept="video/*" multiple className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        
        {/* 视频网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all-300 transform hover:-translate-y-1 group"
            >
              <div className="relative">
                <video 
                  className="w-full aspect-video object-cover rounded-t-xl" 
                  poster={video.thumbnail}
                  controls
                >
                  <source src={video.url} type="video/mp4" />
                  您的浏览器不支持视频播放
                </video>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <i className="fa fa-play-circle text-white text-5xl"></i>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{video.date}</p>
                
                {/* 点赞和评论 */}
                <div className="flex items-center justify-between text-sm mb-3">
                  <button 
                    className="flex items-center text-gray-600 hover:text-primary transition-colors"
                    onClick={() => handleLike(video.id)}
                  >
                    <i className="fa fa-heart mr-1"></i>
                    <span>{video.likes}</span>
                  </button>
                  
                  <span className="text-gray-600">
                    <i className="fa fa-comment-o mr-1"></i>
                    <span>{video.comments.length}</span>
                  </span>
                </div>
                
                {/* 评论列表 */}
                <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
                  {video.comments.map((comment) => (
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
                    value={newComment.videoId === video.id ? newComment.text : ''}
                    onChange={(e) => setNewComment({ videoId: video.id, text: e.target.value })}
                  />
                  <button 
                    className="bg-primary text-white px-3 py-2 rounded-r-lg hover:bg-primary/90 transition-colors"
                    onClick={() => handleCommentSubmit(video.id)}
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

export default Videos