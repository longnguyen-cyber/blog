import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

interface IProps {
  total: number
  callback: (page: number) => void
}
const Pagination = ({ total, callback }: IProps) => {
  const history = useHistory()
  const [page, setPage] = useState(1)
  const newArr = [...Array(total)].map((_, i) => i + 1)

  const isActive = (index: number) => {
    if (index === page) return 'active'
    return ''
  }
  const handlePagenation = (index: number) => {
    history.push(`?page=${index}`)
    callback(index)
  }

  useEffect(() => {
    const num = history.location.search.slice(6) || 1
    setPage(Number(num))
  }, [history.location.search])
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {page > 1 && (
          <li className="page-item" onClick={() => handlePagenation(page - 1)}>
            <span
              aria-label="Next"
              className="page-link"
              style={{ cursor: 'pointer' }}
            >
              Previous
            </span>
          </li>
        )}
        {newArr.map((item) => (
          <li
            className={`page-item ${isActive(item)}`}
            key={item}
            onClick={() => handlePagenation(item)}
          >
            <span
              aria-label="Next"
              className="page-link"
              style={{ cursor: 'pointer' }}
            >
              {item}
            </span>
          </li>
        ))}
        {page < total && (
          <li className="page-item" onClick={() => handlePagenation(page + 1)}>
            <span
              aria-label="Next"
              className="page-link"
              style={{ cursor: 'pointer' }}
            >
              Next
            </span>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Pagination
