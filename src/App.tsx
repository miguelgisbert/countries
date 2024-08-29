import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Continents from './components/continents'
import Countries from './components/countries'

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