import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import { checkHealth } from './services/api'

function App() {
  const [apiStatus, setApiStatus] = useState('loading')
  const [lastChecked, setLastChecked] = useState(null)
  
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await checkHealth()
        setApiStatus('online')
      } catch (error) {
        console.error('API health check failed:', error)
        setApiStatus('offline')
      }
      setLastChecked(new Date())
    }
    
    checkApiStatus()
    
    // Проверяем состояние API каждые 30 секунд
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])
  
  const formatLastChecked = () => {
    if (!lastChecked) return '';
    return lastChecked.toLocaleTimeString();
  }
  
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {apiStatus === 'loading' && (
        <div className="bg-info text-info-content p-2 text-center">
          <div className="flex justify-center items-center gap-2">
            <span className="loading loading-spinner loading-xs"></span>
            <span>Проверка соединения с сервером...</span>
          </div>
        </div>
      )}
      
      {apiStatus === 'offline' && (
        <div className="bg-error text-error-content p-3 text-center shadow-md">
          <div className="flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <strong>Внимание:</strong> Соединение с API недоступно. Пожалуйста, проверьте подключение к серверу.
            <span className="text-xs opacity-80 ml-2">Последняя проверка: {formatLastChecked()}</span>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-2 md:px-4 pb-12 flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Routes>
      </main>
      
      <footer className="footer footer-center p-6 bg-base-300 text-base-content">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Система анализа туш</span>
          </div>
          <div className="text-sm opacity-70">© 2025 - Все права защищены</div>
          
          {apiStatus === 'online' && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
              <span className="opacity-70">API статус: онлайн</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

export default App