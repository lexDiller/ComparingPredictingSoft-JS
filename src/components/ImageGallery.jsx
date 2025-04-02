import { useState, useEffect } from 'react'

const ImageGallery = ({ carcassId, imageAvailability, carcassData }) => {
  const [imageLoading, setImageLoading] = useState({ raw: true, orig: true, new: true })
  const [imageError, setImageError] = useState({ raw: false, orig: false, new: false })
  const [selectedImage, setSelectedImage] = useState(null)
  // Состояние fallback для типов raw и orig
  const [fallback, setFallback] = useState({ raw: 1, orig: 1 })

  useEffect(() => {
    setImageLoading({ raw: true, orig: true, new: true })
    setImageError({ raw: false, orig: false, new: false })
    setSelectedImage(null)
    setFallback({ raw: 1, orig: 1 }) // сброс fallback при смене carcassId
  }, [carcassId])

  const handleImageLoad = (type) => {
    setImageLoading(prev => ({ ...prev, [type]: false }))
  }

  const handleImageError = (type) => {
    setImageLoading(prev => ({ ...prev, [type]: false }))
    setImageError(prev => ({ ...prev, [type]: true }))
    // Если сейчас выбран первый вариант, переключаем на второй
    if (type === 'raw' && fallback.raw === 1) {
      setFallback(prev => ({ ...prev, raw: 2 }))
    }
    if (type === 'orig' && fallback.orig === 1) {
      setFallback(prev => ({ ...prev, orig: 2 }))
    }
  }

  const openModal = (type) => {
    if (imageAvailability[type] && !imageError[type]) {
      setSelectedImage(type)
    }
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  // Формируем пути к изображениям с учётом fallback
  const imageSources = {
    raw: imageAvailability.paths && imageAvailability.paths.raw 
      ? `/images/original_images/${imageAvailability.paths.raw}` 
      : fallback.raw === 1 
        ? `/images/original_images/0000${carcassId}-1c.jpg`
        : `/images/original_images/0000${carcassId}-2c.jpg`,
    orig: imageAvailability.paths && imageAvailability.paths.orig 
      ? `/images/legacy_images/${imageAvailability.paths.orig}` 
      : fallback.orig === 1 
        ? `/images/legacy_images/0000${carcassId}-1s.jpg`
        : `/images/legacy_images/0000${carcassId}-2s.jpg`,
    new: imageAvailability.paths && imageAvailability.paths.new 
      ? `/images/processed_images/${imageAvailability.paths.new}` 
      : `/images/processed_images/processed_${carcassId}.jpg`
  }

  // Рендер модального окна для увеличенного просмотра изображения
  const renderImageModal = () => {
    if (!selectedImage) return null
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={closeModal}>
        <div className="relative max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
          <img 
            src={imageSources[selectedImage]} 
            alt={`${selectedImage} image view`} 
            className="max-w-full max-h-[90vh] object-contain"
          />
          <button 
            className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  // Рендер карточки изображения
  const renderImageCard = (type, title) => {
    if (!imageAvailability[type]) {
      return (
        <div className="card bg-base-100 border h-full shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="h-72 w-full bg-base-200 rounded-t-xl flex flex-col items-center justify-center">
            <div className="text-4xl mb-2 opacity-50">📷</div>
            <p className="text-base-content opacity-50">Изображение недоступно</p>
          </div>
          <div className="card-body p-4">
            <h2 className="card-title text-lg">{title}</h2>
          </div>
        </div>
      )
    }

    return (
      <div className="card bg-base-100 border h-full shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-72 w-full cursor-pointer" onClick={() => openModal(type)}>
          <img 
            key={`${carcassId}-${type}-${fallback[type]}`}
            src={imageSources[type]} 
            alt={title} 
            className={`rounded-t-xl object-contain h-full w-full ${imageLoading[type] ? 'invisible' : 'visible'}`}
            onLoad={() => handleImageLoad(type)}
            onError={() => handleImageError(type)}
          />
          {imageLoading[type] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
          {imageError[type] && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-200 rounded-t-xl">
              <div className="text-center p-4">
                <div className="text-error text-4xl mb-2">⚠️</div>
                <div className="text-error font-medium">Ошибка загрузки</div>
                <div className="text-sm mt-2 opacity-70">Файл не найден или недоступен</div>
              </div>
            </div>
          )}
          {!imageLoading[type] && !imageError[type] && (
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-3xl opacity-0 group-hover:opacity-100">🔍</div>
            </div>
          )}
        </div>
        <div className="card-body p-4">
          <h2 className="card-title text-lg">{title}</h2>
          {type === 'orig' && (
            <div className="stats shadow-sm bg-base-200 text-sm mt-2">
              <div className="stat p-2">
                <div className="stat-title text-xs">Marbling</div>
                <div className="stat-value text-xl">{carcassData.marbling_legacy || 'N/A'}</div>
                <div className="stat-desc">{carcassData.marbling_legacy_grade || 'N/A'}</div>
              </div>
            </div>
          )}
          {type === 'new' && (
            <div className="stats shadow-sm bg-base-200 text-sm mt-2">
              <div className="stat p-2">
                <div className="stat-title text-xs">Marbling</div>
                <div className="stat-value text-xl">{carcassData.marbling_predict || 'N/A'}</div>
                <div className="stat-desc">{carcassData.marbling_predict_grade || 'N/A'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const calculateDifference = (legacy, predict) => {
    if (!legacy || !predict) return null
    const diff = ((predict - legacy) / legacy * 100).toFixed(1)
    return {
      value: diff,
      isPositive: diff > 0
    }
  }

  const marblingDiff = calculateDifference(
    carcassData.marbling_legacy, 
    carcassData.marbling_predict
  )

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {renderImageCard('raw', 'Исходное изображение')}
        {renderImageCard('orig', 'Оригинальный анализ')}
        {renderImageCard('new', 'Новый анализ')}
      </div>
      
      {imageAvailability.orig && imageAvailability.new && (
        <div className="card bg-base-200 shadow">
          <div className="card-body p-6">
            <h3 className="card-title text-xl flex items-center gap-2">
              <span className="text-primary">📊</span> 
              Сравнение анализа
            </h3>
            
            {/* 
              Увеличили количество столбцов до 3, чтобы в одной строке 
              поместить: 
                1) Показатель Marbling 
                2) Категория (Grade) 
                3) Качество (Quality) 
            */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              
              {/* Показатель Marbling */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium mb-1">Показатель Marbling</div>
                <div className="flex items-center gap-2">
                  <div className="stats bg-base-200 shadow-sm">
                    <div className="stat p-2">
                      <div className="stat-title text-xs">Исходное</div>
                      <div className="stat-value text-xl">{carcassData.marbling_legacy || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="text-xl">→</div>
                  <div className="stats bg-base-200 shadow-sm">
                    <div className="stat p-2">
                      <div className="stat-title text-xs">Новое</div>
                      <div className="stat-value text-xl">{carcassData.marbling_predict || 'N/A'}</div>
                    </div>
                  </div>
                  {marblingDiff && (
                    <div className={`badge badge-lg ml-2 ${marblingDiff.isPositive ? 'badge-success' : 'badge-error'}`}>
                      {marblingDiff.isPositive ? '+' : ''}{marblingDiff.value}%
                    </div>
                  )}
                </div>
              </div>

              {/* Категория (Grade) */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium mb-1">Категория (Grade)</div>
                <div className="flex items-center gap-2">
                  <div className="stats bg-base-200 shadow-sm">
                    <div className="stat p-2">
                      <div className="stat-title text-xs">Исходное</div>
                      <div className="stat-value text-xl">{carcassData.marbling_legacy_grade || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="text-xl">→</div>
                  <div className="stats bg-base-200 shadow-sm">
                    <div className="stat p-2">
                      <div className="stat-title text-xs">Новое</div>
                      <div className="stat-value text-xl">{carcassData.marbling_predict_grade || 'N/A'}</div>
                    </div>
                  </div>
                  {carcassData.marbling_legacy_grade !== carcassData.marbling_predict_grade && (
                    <div className="badge badge-lg badge-warning ml-2">Изменилось</div>
                  )}
                </div>
              </div>

              {/* Качество (Quality) */}
              <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium mb-1">Качество (Quality)</div>
                <div className="flex items-center gap-2">
                  <div className="stats bg-base-200 shadow-sm">
                    <div className="stat p-2">
                      <div className="stat-title text-xs">Исходное</div>
                      <div className="stat-value text-xl">{carcassData.marbling_legacy_quality || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="text-xl">→</div>
                  <div className="stats bg-base-200 shadow-sm">
                    <div className="stat p-2">
                      <div className="stat-title text-xs">Новое</div>
                      <div className="stat-value text-xl">{carcassData.marbling_predict_quality || 'N/A'}</div>
                    </div>
                  </div>
                  {carcassData.marbling_legacy_quality !== carcassData.marbling_predict_quality && (
                    <div className="badge badge-lg badge-warning ml-2">Изменилось</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      
      {renderImageModal()}
    </div>
  )
}

export default ImageGallery
