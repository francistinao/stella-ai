import { HashRouter as Router, Routes, Route } from 'react-router-dom'

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Hello</h1>} />
      </Routes>
    </Router>
  )
}

export default App
