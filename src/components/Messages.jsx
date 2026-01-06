import React, { useState } from 'react'

const Messages = () => {
  // 从localStorage获取留言，如果没有则使用默认值
  const getMessagesFromStorage = () => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      return JSON.parse(storedMessages);
    }
    // 默认留言
    return [
      {
        id: 1,
        name: '小明',
        email: 'xiaoming@example.com',
        message: '祝宝宝健康快乐成长，永远被爱包围！',
        date: '2024-01-15'
      },
      {
        id: 2,
        name: '小红',
        email: 'xiaohong@example.com',
        message: '可爱的宝宝，愿你有一个美好的未来！',
        date: '2024-01-16'
      },
      {
        id: 3,
        name: '小李',
        email: 'xiaoli@example.com',
        message: '愿宝宝在爱的阳光下茁壮成长，成为一个善良、勇敢、有担当的人！',
        date: '2024-01-17'
      },
    ];
  };
  
  const [messages, setMessages] = useState(getMessagesFromStorage());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // 保存留言到localStorage
  const saveMessagesToStorage = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('messages', JSON.stringify(newMessages));
  };

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 创建新留言
    const newMessage = {
      id: messages.length + 1,
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };
    
    // 添加到留言列表
    saveMessagesToStorage([newMessage, ...messages]);
    
    // 清空表单
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    
    // 显示成功提示
    alert('留言提交成功！感谢您的祝福！');
  };

  return (
    <section id="messages" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl animate-slide-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            <i className="fa fa-comments text-primary mr-2"></i>
            游客寄语
          </h2>
          <p className="text-gray-600">留下您对宝宝的美好祝福</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 留言表单 */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all-300 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">写下您的祝福</h3>
            <form id="messageForm" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">姓名</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-300"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">邮箱</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-300"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-1">留言内容</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-300"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all-300 transform hover:scale-105 active:scale-95"
              >
                提交留言
              </button>
            </form>
          </div>
          
          {/* 留言列表 */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all-300 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">最新祝福</h3>
            <div id="messagesList" className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="bg-gray-50 p-4 rounded-lg animate-fade-in">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{message.name}</h4>
                    <span className="text-xs text-gray-500">{message.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{message.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages