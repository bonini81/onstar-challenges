import { Routes, Route } from 'react-router-dom'
import Welcome from './components/Welcome/Welcome'
import Criterios from './components/Criterios/Criterios'
import Registro from './components/Registro/Registro'
import Confirmacion from './components/Confirmacion/Confirmacion'
import LaMision from './components/LaMision/LaMision'
import PerfilCliente from './components/PerfilCliente/PerfilCliente'
import ProblemaCliente from './components/ProblemaCliente/ProblemaCliente'
import MisionEquipo from './components/MisionEquipo/MisionEquipo'
import FuncionesRecomendadas from './components/FuncionesRecomendadas/FuncionesRecomendadas'
import PuntosObligatorios from './components/PuntosObligatorios/PuntosObligatorios'
import CierreSugerido from './components/CierreSugerido/CierreSugerido'
import TiempoCumplido from './components/TiempoCumplido/TiempoCumplido'
import CalificacionParte1 from './components/CalificacionParte1/CalificacionParte1'
import CalificacionParte2 from './components/CalificacionParte2/CalificacionParte2'
import ScoreFinal from './components/ScoreFinal/ScoreFinal'
import RankingEspera from './components/RankingEspera/RankingEspera'
import RankingFinal from './components/RankingFinal/RankingFinal'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/criterios" element={<Criterios />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/confirmacion" element={<Confirmacion />} />
      <Route path="/mision" element={<LaMision />} />
      <Route path="/perfil-cliente" element={<PerfilCliente />} />
      <Route path="/problema-cliente" element={<ProblemaCliente />} />
      <Route path="/mision-equipo" element={<MisionEquipo />} />
      <Route path="/funciones-recomendadas" element={<FuncionesRecomendadas />} />
      <Route path="/puntos-obligatorios" element={<PuntosObligatorios />} />
      <Route path="/cierre-sugerido" element={<CierreSugerido />} />
      <Route path="/tiempo-cumplido" element={<TiempoCumplido />} />
      <Route path="/calificacion-1" element={<CalificacionParte1 />} />
      <Route path="/calificacion-2" element={<CalificacionParte2 />} />
      <Route path="/score" element={<ScoreFinal />} />
      <Route path="/ranking-espera" element={<RankingEspera />} />
      <Route path="/ranking" element={<RankingFinal />} />
    </Routes>
  )
}

export default App
