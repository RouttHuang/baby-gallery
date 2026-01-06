import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Welcome from './components/Welcome'
import Timer from './components/Timer'
import Gallery from './components/Gallery'
import Videos from './components/Videos'
import Milestones from './components/Milestones'
import Messages from './components/Messages'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Router>
      {/* 导航栏 */}
      <nav 
        className={`fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 transition-all-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-primary flex items-center">
            <i className="fa fa-baby mr-2"></i>
            宝宝成长纪念册
          </h1>
          
          {/* 桌面导航 */}
          <ul className="hidden md:flex space-x-6">
            <li><Link to="/" className="text-gray-600 hover:text-primary transition-all-300 font-medium">欢迎词</Link></li>
            <li><Link to="/timer" className="text-gray-600 hover:text-primary transition-all-300 font-medium">成长计时</Link></li>
            <li><Link to="/gallery" className="text-gray-600 hover:text-primary transition-all-300 font-medium">宝宝相册</Link></li>
            <li><Link to="/videos" className="text-gray-600 hover:text-primary transition-all-300 font-medium">视频集锦</Link></li>
            <li><Link to="/milestones" className="text-gray-600 hover:text-primary transition-all-300 font-medium">宝宝大事纪</Link></li>
            <li><Link to="/messages" className="text-gray-600 hover:text-primary transition-all-300 font-medium">游客寄语</Link></li>
          </ul>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden text-gray-600 hover:text-primary transition-all-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fa fa-bars text-2xl"></i>
          </button>
        </div>
        
        {/* 移动端导航菜单 */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white shadow-md">
              <ul className="container mx-auto px-4 py-2 space-y-3">
                <li><Link to="/" className="block py-2 text-gray-600 hover:text-primary transition-all-300 font-medium" onClick={() => setMobileMenuOpen(false)}>欢迎词</Link></li>
                <li><Link to="/timer" className="block py-2 text-gray-600 hover:text-primary transition-all-300 font-medium" onClick={() => setMobileMenuOpen(false)}>成长计时</Link></li>
                <li><Link to="/gallery" className="block py-2 text-gray-600 hover:text-primary transition-all-300 font-medium" onClick={() => setMobileMenuOpen(false)}>宝宝相册</Link></li>
                <li><Link to="/videos" className="block py-2 text-gray-600 hover:text-primary transition-all-300 font-medium" onClick={() => setMobileMenuOpen(false)}>视频集锦</Link></li>
                <li><Link to="/milestones" className="block py-2 text-gray-600 hover:text-primary transition-all-300 font-medium" onClick={() => setMobileMenuOpen(false)}>宝宝大事纪</Link></li>
                <li><Link to="/messages" className="block py-2 text-gray-600 hover:text-primary transition-all-300 font-medium" onClick={() => setMobileMenuOpen(false)}>游客寄语</Link></li>
              </ul>
            </div>
          )}
      </nav>

      {/* 主内容区 */}
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </main>

      {/* 回到顶部按钮 */}
      <button 
        id="backToTop" 
        className={`fixed bottom-6 right-6 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all-300 z-50 ${isScrolled ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fa fa-arrow-up"></i>
      </button>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="fa fa-baby text-primary mr-2"></i>
                宝宝成长纪念册
              </h3>
              <p className="text-gray-400 mb-4">记录宝宝成长的每一个珍贵瞬间</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-all-300">
                  <i className="fa fa-weixin text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-all-300">
                  <i className="fa fa-weibo text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-all-300">
                  <i className="fa fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-primary transition-all-300">欢迎词</Link></li>
                <li><Link to="/timer" className="text-gray-400 hover:text-primary transition-all-300">成长计时</Link></li>
                <li><Link to="/gallery" className="text-gray-400 hover:text-primary transition-all-300">宝宝相册</Link></li>
                <li><Link to="/videos" className="text-gray-400 hover:text-primary transition-all-300">视频集锦</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">联系我们</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <i className="fa fa-envelope-o mr-2"></i>
                  <span>contact@example.com</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <i className="fa fa-phone mr-2"></i>
                  <span>138-0013-8000</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <i className="fa fa-map-marker mr-2"></i>
                  <span>北京市朝阳区</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} 宝宝成长纪念册. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </Router>
  )
}

export default App