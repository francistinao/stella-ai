import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Menu, System, Preloader } from '@/pages/pages.ts'

function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 12000)
  }, [])

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/system" element={<System />} />
          </Routes>
        </Router>
      )}
    </>
  )
}

export default App
