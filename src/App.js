import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import VerboUno from './screen/AdivinarScreen';
import Home from './Home';
import TraduccionScreen from './screen/TraduccionScreen';


function App() {

    return (
            <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adivinar/didomi" element={<VerboUno />} />
        <Route path="/traducciones/didomi" element={<TraduccionScreen />} />
      </Routes>
    </Router>

    )


}

export default App;