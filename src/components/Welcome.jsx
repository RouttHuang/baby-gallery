import React from 'react'
import { Link } from 'react-router-dom'

const Welcome = () => {
  return (
    <section id="welcome" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 py-20 px-4">
      <div className="container mx-auto max-w-4xl animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="inline-block bg-primary/10 p-4 rounded-full mb-6">
            <i className="fa fa-heart text-4xl text-primary"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">欢迎来到宝宝的成长纪念册</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            亲爱的宝贝，欢迎来到这个美好的世界！这是爸爸妈妈为你创建的成长纪念册，
            我们将在这里记录你成长的每一个珍贵瞬间，
            见证你从一个小小的婴儿成长为一个独一无二的个体。
            愿你永远健康快乐，被爱包围。
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/gallery" className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full transition-all-300 transform hover:scale-105 hover:shadow-lg">
              查看相册
            </Link>
            <Link to="/milestones" className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 px-8 rounded-full transition-all-300 transform hover:scale-105 hover:shadow-lg border border-gray-200">
              成长大事纪
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Welcome