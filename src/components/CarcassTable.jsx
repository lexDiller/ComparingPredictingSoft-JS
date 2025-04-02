// src/components/CarcassTable.jsx
import { useState } from 'react'

const CarcassTable = ({ data, onRowClick }) => {
  const [sortField, setSortField] = useState('carcass_id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [hoveredRow, setHoveredRow] = useState(null)
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const sortedData = [...data].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    // Handle null values
    if (aValue === null) return sortDirection === 'asc' ? 1 : -1
    if (bValue === null) return sortDirection === 'asc' ? -1 : 1
    
    // Handle string comparisons
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })
  
  // Helper function to determine if values are different
  const isDifferent = (legacy, predict) => {
    if (legacy === null || predict === null) return false
    if (typeof legacy === 'number' && typeof predict === 'number') {
      return Math.abs(legacy - predict) > 0.5 // Allow small differences
    }
    return legacy !== predict
  }
  
  // Get appropriate styling for comparison cells
  const getComparisonStyle = (legacy, predict) => {
    if (isDifferent(legacy, predict)) {
      return "bg-yellow-50 font-medium text-yellow-800"
    }
    return ""
  }
  
  const renderSortIcon = (field) => {
    if (field !== sortField) return null
    return (
      <span className="ml-1 text-primary">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  const renderSortableHeader = (field, label, colSpan = 1, className = "") => (
    <th 
      onClick={() => handleSort(field)} 
      colSpan={colSpan}
      className={`cursor-pointer hover:bg-base-300 transition-colors duration-200 ${className}`}
    >
      <div className="flex items-center justify-center">
        {label} {renderSortIcon(field)}
      </div>
    </th>
  );
  
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-base-200 text-base-content border-b border-base-300">
            {renderSortableHeader('carcass_id', 'ID')}
            {renderSortableHeader('weight_legacy', 'Weight')}
            
            {/* REA */}
            <th colSpan="2" className="text-center bg-blue-50 text-blue-800 border-b border-blue-200">REA</th>
            
            {/* Marbling */}
            <th colSpan="2" className="text-center bg-green-50 text-green-800 border-b border-green-200">Marbling</th>
            
            {/* Grade */}
            <th colSpan="2" className="text-center bg-purple-50 text-purple-800 border-b border-purple-200">Grade</th>

            {/* Добавляем новую группу столбцов для Marbling Quality */}
            <th colSpan="2" className="text-center bg-yellow-50 text-yellow-800 border-b border-yellow-200">
              Marbling Quality
            </th>
          </tr>
          <tr className="bg-base-100 text-sm">
            {/* ID */}
            <th></th>
            {/* Weight */}
            <th></th>
            
            {/* REA: Legacy / Predict */}
            {renderSortableHeader('rea_legacy', 'Legacy', 1, "bg-blue-50 text-blue-800 border-r border-blue-100")}
            {renderSortableHeader('rea_predict', 'Predict', 1, "bg-blue-50 text-blue-800")}
            
            {/* Marbling: Legacy / Predict */}
            {renderSortableHeader('marbling_legacy', 'Legacy', 1, "bg-green-50 text-green-800 border-r border-green-100")}
            {renderSortableHeader('marbling_predict', 'Predict', 1, "bg-green-50 text-green-800")}
            
            {/* Grade: Legacy / Predict */}
            {renderSortableHeader('marbling_legacy_grade', 'Legacy', 1, "bg-purple-50 text-purple-800 border-r border-purple-100")}
            {renderSortableHeader('marbling_predict_grade', 'Predict', 1, "bg-purple-50 text-purple-800")}

            {/* Marbling Quality: Legacy / Predict */}
            {renderSortableHeader('marbling_legacy_quality', 'Legacy', 1, "bg-yellow-50 text-yellow-800 border-r border-yellow-100")}
            {renderSortableHeader('marbling_predict_quality', 'Predict', 1, "bg-yellow-50 text-yellow-800")}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr 
              key={row.carcass_id} 
              onClick={() => onRowClick(row.carcass_id)}
              onMouseEnter={() => setHoveredRow(row.carcass_id)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`
                hover:bg-base-200 cursor-pointer transition-colors duration-200
                ${hoveredRow === row.carcass_id ? 'bg-base-200' : ''}
              `}
            >
              {/* ID */}
              <td className="font-medium text-base-content">
                <div className="flex items-center gap-2">
                  {row.carcass_id}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </td>
              {/* Weight (Legacy) */}
              <td className="font-medium">
                {row.weight_legacy || 'N/A'}
              </td>
              
              {/* REA (Legacy) */}
              <td className="border-r border-blue-100 bg-blue-50 text-black">
                {row.rea_legacy || 'N/A'}
              </td>
              {/* REA (Predict) */}
              <td className={`bg-blue-50 text-base-content ${getComparisonStyle(row.rea_legacy, row.rea_predict)}`}>
                {row.rea_predict || 'N/A'}
                {isDifferent(row.rea_legacy, row.rea_predict) && (
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 ml-1"></span>
                )}
              </td>
              
              {/* Marbling (Legacy) */}
              <td className="border-r border-green-100 bg-green-50 text-black">
                {row.marbling_legacy || 'N/A'}
              </td>
              {/* Marbling (Predict) */}
              <td className={`bg-green-50 text-base-content ${getComparisonStyle(row.marbling_legacy, row.marbling_predict)}`}>
                {row.marbling_predict || 'N/A'}
                {isDifferent(row.marbling_legacy, row.marbling_predict) && (
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 ml-1"></span>
                )}
              </td>
              
              {/* Grade (Legacy) */}
              <td className="border-r border-purple-100 bg-purple-50 text-black">
                {row.marbling_legacy_grade || 'N/A'}
              </td>
              {/* Grade (Predict) */}
              <td className={`bg-purple-50 text-base-content ${getComparisonStyle(row.marbling_legacy_grade, row.marbling_predict_grade)}`}>
                {row.marbling_predict_grade || 'N/A'}
                {isDifferent(row.marbling_legacy_grade, row.marbling_predict_grade) && (
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 ml-1"></span>
                )}
              </td>

              {/* Marbling Quality (Legacy) */}
              <td className="border-r border-yellow-100 bg-yellow-50 text-black">
                {row.marbling_legacy_quality || 'N/A'}
              </td>
              {/* Marbling Quality (Predict) */}
              <td className={`bg-yellow-50 text-base-content ${getComparisonStyle(row.marbling_legacy_quality, row.marbling_predict_quality)}`}>
                {row.marbling_predict_quality || 'N/A'}
                {isDifferent(row.marbling_legacy_quality, row.marbling_predict_quality) && (
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 ml-1"></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CarcassTable
