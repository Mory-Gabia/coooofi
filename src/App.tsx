import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Ladder } from './pages/Ladder'
import { Roulette } from './pages/Roulette'
import { RandomPick } from './pages/RandomPick'
import { NumberGame } from './pages/NumberGame'
import { Dice } from './pages/Dice'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ladder" element={<Ladder />} />
        <Route path="/roulette" element={<Roulette />} />
        <Route path="/random-pick" element={<RandomPick />} />
        <Route path="/number-game" element={<NumberGame />} />
        <Route path="/dice" element={<Dice />} />
      </Routes>
    </BrowserRouter>
  )
}
