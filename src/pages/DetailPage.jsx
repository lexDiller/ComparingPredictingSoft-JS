import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCarcassDetail, checkImages } from '../services/api'
import ImageGallery from '../components/ImageGallery'

const DetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [carcassData, setCarcassData] = useState(null)
  const [imageAvailability, setImageAvailability] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('images')
  
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Загружаем данные по туше
      const data = await fetchCarcassDetail(id)
      setCarcassData(data)
      
      // Проверяем наличие изображений
      const images = await checkImages(id)
      setImageAvailability(images)
      
      setError(null)
    } catch (err) {
      setError('Не удалось загрузить данные. Пожалуйста, попробуйте снова.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [id])
  
  const handleBack = () => {
    navigate('/')
  }
  
  // Группировка данных для отображения
  const groupData = () => {
    if (!carcassData) return {}
    
    return {
      'Основная информация': ['carcass_id', 'weight_legacy'],
      'REA анализ': ['rea_legacy', 'rea_predict', 'reheight_mm_legacy', 'rebroad_mm_legacy', 'main_axis_length_predict', 'perpendicular_axis_length_predict'],
      'Показатели выхода': ['yieldgrade_legacy', 'yieldgrade_legacy_grade', 'yieldgrade_predict', 'yieldgrade_predict_grade', 'adjpyg_legacy', 'adjpyg_predict', 'actualpyg_legacy', 'actualpyg_predict'],
      'Показатели мраморности': ['marbling_legacy', 'marbling_legacy_grade', 'marbling_legacy_quality', 'marbling_predict', 'marbling_predict_grade', 'marbling_predict_quality']
    }
  }
  
  // Форматирование названий полей
  const formatFieldName = (field) => {
    return field
      .replace(/_/g, ' ')
      .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2)
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg font-medium">Загрузка данных...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <button className="btn btn-outline btn-primary gap-2 mb-6" onClick={handleBack}>
          ← Назад к списку
        </button>
        <div className="alert alert-error shadow-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-2">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
          <button className="btn btn-sm btn-outline" onClick={loadData}>Повторить</button>
        </div>
      </div>
    )
  }
  
  if (!carcassData) {
    return (
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <button className="btn btn-outline btn-primary gap-2 mb-6" onClick={handleBack}>
          ← Назад к списку
        </button>
        <div className="alert alert-warning shadow-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-2">⚠️</span>
            <span className="font-medium">Данные не найдены</span>
          </div>
        </div>
      </div>
    )
  }
  
  const groups = groupData()
  
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <button 
          className="btn btn-outline btn-primary gap-2 hover:bg-primary hover:text-primary-content transition-colors duration-300" 
          onClick={handleBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Назад к списку
        </button>
        <h1 className="text-3xl font-bold text-primary">ID туши: <span className="text-base-content">{id}</span></h1>
        <div className="stats shadow-md bg-primary text-primary-content">
          <div className="stat p-4">
            <div className="stat-title text-primary-content opacity-70">Вес</div>
            <div className="stat-value text-3xl">{carcassData.weight_legacy || 'N/A'}</div>
            <div className="stat-desc text-primary-content opacity-70">кг</div>
          </div>
        </div>
      </div>
      
      {/* Переключение вкладок */}
      <div className="tabs tabs-boxed bg-base-200 p-1 mb-8 inline-flex gap-2 rounded-xl">
        <a 
          className={`tab tab-lg transition-all duration-200 gap-2 ${activeTab === 'images' ? 'tab-active bg-primary text-primary-content rounded-lg' : 'hover:bg-base-300 rounded-lg'}`}
          onClick={() => setActiveTab('images')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          Изображения
        </a>
        <a 
          className={`tab tab-lg transition-all duration-200 gap-2 ${activeTab === 'data' ? 'tab-active bg-primary text-primary-content rounded-lg' : 'hover:bg-base-300 rounded-lg'}`}
          onClick={() => setActiveTab('data')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
          </svg>
          Данные анализа
        </a>
      </div>
      
      {activeTab === 'images' && (
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Изображения туши
            </h2>
            <p className="text-base-content opacity-70 mb-6">
              Просмотр и сравнение исходного изображения, оригинального и нового анализа
            </p>
            <ImageGallery 
              carcassId={id} 
              imageAvailability={imageAvailability} 
              carcassData={carcassData} 
            />
          </div>
        </div>
      )}
      
      {activeTab === 'data' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
              Данные анализа
            </h2>
            <p className="text-base-content opacity-70 mb-6">
              Детальные метрики оценки качества туши
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(groups).map(([groupName, fields]) => (
                <div key={groupName} className="card bg-base-200 shadow overflow-hidden">
                  <div className="card-body p-0">
                    <div className="bg-primary text-primary-content p-4">
                      <h3 className="text-lg font-medium">{groupName}</h3>
                    </div>
                    <div className="p-1"> 
                      <div className="overflow-x-auto">
                        <table className="table w-full">
                          <tbody>
                            {fields.map((field) => {
                              const isComparisonField = field.includes('legacy') && field.replace('legacy', 'predict') in carcassData;
                              const predictField = field.replace('legacy', 'predict');
                              
                              return (
                                <tr key={field} className={isComparisonField ? "border-b border-base-300" : ""}>
                                  <th className="bg-base-200 font-medium text-sm">{formatFieldName(field)}</th>
                                  <td className={carcassData[field] === null ? "opacity-50" : ""}>
                                    {carcassData[field] !== null ? carcassData[field] : 'N/A'}
                                    
                                    {isComparisonField && carcassData[field] !== null && carcassData[predictField] !== null && (
                                      carcassData[field] !== carcassData[predictField] && (
                                        <div className="mt-1">
                                          <span className="badge badge-sm badge-outline">
                                            Оригинал: {carcassData[field]}
                                          </span>
                                          <span className="badge badge-sm badge-outline badge-primary ml-1">
                                            Прогноз: {carcassData[predictField]}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailPage