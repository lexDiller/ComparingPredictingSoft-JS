// src/pages/HomePage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCarcassData } from '../services/api'
import CarcassTable from '../components/CarcassTable'

const HomePage = () => {
  const [carcassData, setCarcassData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const navigate = useNavigate()
  
  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchCarcassData()
      setCarcassData(data)
      setFilteredData(data)
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Не удалось загрузить данные. Пожалуйста, попробуйте снова.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      handleRefresh(true)
    }, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    // Filter data when search term changes
    if (searchTerm.trim() === '') {
      setFilteredData(carcassData)
    } else {
      const lowercasedSearch = searchTerm.toLowerCase()
      const filtered = carcassData.filter(item => {
        return Object.values(item).some(value => 
          value !== null && 
          value.toString().toLowerCase().includes(lowercasedSearch)
        )
      })
      setFilteredData(filtered)
    }
  }, [searchTerm, carcassData])
  
  const handleRowClick = (id) => {
    navigate(`/detail/${id}`)
  }
  
  const handleRefresh = async (silent = false) => {
    if (!silent) {
      setRefreshing(true)
    }
    await loadData()
    setTimeout(() => {
      setRefreshing(false)
    }, 500) // Minimum refresh animation time
  }

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Никогда';
    
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000); // difference in seconds
    
    if (diff < 60) return `${diff} сек. назад`;
    if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
    
    return lastUpdated.toLocaleTimeString();
  }
  
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">База данных анализа туш</h1>
          <p className="text-base-content opacity-70">Просмотр и анализ данных по исследованиям качества туш</p>
        </div>
        
        <div className="stats bg-primary text-primary-content shadow-md">
          <div className="stat p-4">
            <div className="stat-title text-primary-content opacity-70">Всего записей</div>
            <div className="stat-value text-4xl">{carcassData.length}</div>
            <div className="stat-desc text-primary-content opacity-70">
              Обновлено: {formatLastUpdated()}
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error mb-6 shadow-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>Закрыть</button>
          </div>
        </div>
      )}
      
      <div className="bg-base-100 rounded-box shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          {/* Search Box */}
          <div className="form-control w-full md:max-w-md">
            <div className="input-group shadow-sm">
              <input 
                type="text" 
                placeholder="Поиск по любому полю..." 
                className="input input-bordered w-full focus:outline-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square bg-primary border-primary hover:bg-primary-focus">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            {searchTerm && (
              <div className="text-sm mt-1 flex gap-2 items-center">
                <span className="opacity-70">Найдено: {filteredData.length}</span>
                {filteredData.length !== carcassData.length && (
                  <button 
                    className="btn btn-xs btn-ghost" 
                    onClick={() => setSearchTerm('')}
                  >
                    Сбросить
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button 
            className={`btn btn-primary shadow-md ${refreshing ? 'loading' : ''}`}
            onClick={() => handleRefresh()}
            disabled={loading || refreshing}
          >
            {!refreshing && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {refreshing ? 'Обновление...' : 'Обновить данные'}
          </button>
        </div>
        
        {/* Table or Loading State */}
        {(loading && carcassData.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-lg font-medium">Загрузка данных из базы...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <CarcassTable data={filteredData} onRowClick={handleRowClick} />
        ) : (
          <div className="alert alert-info shadow-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-medium">Данные не найдены</p>
                <p className="text-sm opacity-70">Попробуйте изменить параметры поиска</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage