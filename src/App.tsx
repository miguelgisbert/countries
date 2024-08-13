import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Continents from './components/Continents'
import Countries from './components/Countries'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Continents />} />
        <Route path="/countries/:continent" element={<Countries />} />
      </Routes>
    </Router>
  )
}

export default App