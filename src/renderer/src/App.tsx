import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Menu } from '@/pages/pages.ts'

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
      </Routes>
    </Router>
  )
}

export default App
