import React, { useState } from 'react'

const Milestones = () => {
  // 从localStorage获取里程碑，如果没有则使用默认值
  const getMilestonesFromStorage = () => {
    const storedMilestones = localStorage.getItem('milestones');
    if (storedMilestones) {
      return JSON.parse(storedMilestones);
    }
    // 默认里程碑
    return [
      {
        id: 1,
        date: '2024-01-01',
        title: '宝宝出生',
        description: '体重：3.2kg，身长：50cm',
        icon: 'fa-baby'
      },
      {
        id: 2,
        date: '2024-03-15',
        title: '第一次微笑',
        description: '宝宝第一次对妈妈露出了甜美的微笑',
        icon: 'fa-smile-o'
      },
      {
        id: 3,
        date: '2024-06-20',
        title: '第一次爬行',
        description: '宝宝学会了用手和膝盖爬行，开始探索世界',
        icon: 'fa-child'
      },
      {
        id: 4,
        date: '2024-09-01',
        title: '第一次说话',
        description: '宝宝第一次清晰地说出了"妈妈"',
        icon: 'fa-comment-o'
      },
    ];
  };
  
  const [milestones, setMilestones] = useState(getMilestonesFromStorage());

  // 保存里程碑到localStorage
  const saveMilestonesToStorage = (newMilestones) => {
    setMilestones(newMilestones);
    localStorage.setItem('milestones', JSON.stringify(newMilestones));
  };

  return (
    <section id="milestones" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl animate-slide-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            <i className="fa fa-star text-primary mr-2"></i>
            宝宝大事纪
          </h2>
          <p className="text-gray-600">记录宝宝成长的重要里程碑</p>
        </div>
        
        {/* 时间线 */}
        <div className="relative">
          {/* 时间线中心线 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-secondary"></div>
          
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.id} 
              className={`relative mb-12 md:mb-16 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:pl-0 mb-6 md:mb-0 text-right">
                  {index % 2 === 0 && (
                    <div className="bg-primary/10 p-5 rounded-xl shadow-sm hover:shadow-md transition-all-300">
                      <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-2">{milestone.date}</span>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="z-10 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all-300">
                  <i className={`fa ${milestone.icon}`}></i>
                </div>
                
                <div className="md:w-1/2 md:pl-12">
                  {index % 2 !== 0 && (
                    <div className="bg-primary/10 p-5 rounded-xl shadow-sm hover:shadow-md transition-all-300">
                      <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-2">{milestone.date}</span>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Milestones