import React, { useState, useEffect } from 'react'

const Timer = () => {
  // 从localStorage获取生日，如果没有则使用默认值
  const savedBirthday = localStorage.getItem('babyBirthday') || '2024-01-01'
  const [birthday, setBirthday] = useState(savedBirthday)
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // 计算时间差
  const calculateTime = () => {
    const birthDate = new Date(birthday)
    const now = new Date()
    const diff = now - birthDate

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTime({ days, hours, minutes, seconds })
  }

  // 保存生日到localStorage
  const saveBirthday = (newBirthday) => {
    setBirthday(newBirthday)
    localStorage.setItem('babyBirthday', newBirthday)
  }

  // 初始化和每秒更新
  useEffect(() => {
    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [birthday])

  return (
    <section id="timer" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl animate-slide-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            <i className="fa fa-clock-o text-primary mr-2"></i>
            宝宝成长计时
          </h2>
          <p className="text-gray-600">记录宝宝来到这个世界的每一刻</p>
        </div>
        
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl shadow-lg p-8 md:p-12">
          {/* 生日设置 */}
          <div className="mb-8 text-center">
            <label htmlFor="birthday" className="block text-gray-700 font-medium mb-2">设置宝宝生日：</label>
            <input 
              type="date" 
              id="birthday" 
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all-300"
              value={birthday}
              onChange={(e) => saveBirthday(e.target.value)}
            />
          </div>
          
          {/* 计时器显示 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all-300">
              <div className="text-4xl md:text-5xl font-bold text-primary">{time.days}</div>
              <div className="text-sm text-gray-600 mt-1">天</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all-300">
              <div className="text-4xl md:text-5xl font-bold text-primary">{time.hours}</div>
              <div className="text-sm text-gray-600 mt-1">小时</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all-300">
              <div className="text-4xl md:text-5xl font-bold text-primary">{time.minutes}</div>
              <div className="text-sm text-gray-600 mt-1">分钟</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all-300">
              <div className="text-4xl md:text-5xl font-bold text-primary">{time.seconds}</div>
              <div className="text-sm text-gray-600 mt-1">秒</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Timer