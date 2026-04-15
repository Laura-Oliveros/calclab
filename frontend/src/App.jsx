import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import DerivativesMenu from "./pages/DerivativesMenu";
import BasicDerivativesMenu from "./pages/BasicDerivativesMenu";
import DerivativeSolverPage from "./pages/DerivativeSolverPage";
import LimitsMenu from "./pages/LimitsMenu";
import LimitSolverPage from "./pages/LimitSolverPage";
import Ranking from "./pages/Ranking";
import LoginRanking from "./pages/LoginRanking";
import PlayLabMenu from "./pages/PlayLabMenu";
import EscapeMathGame from "./pages/EscapeMathGame";
import PuzzleStepsGame from "./pages/PuzzleStepsGame";
import MathRaceGame from "./pages/MathRaceGame";
import MathBattleGame from "./pages/MathBattleGame";
import QuizLevelsPage from "./pages/QuizLevelsPage";
import QuizTopicLevelsPage from "./pages/QuizTopicLevelsPage";
import QuizPage from "./pages/QuizPage";
import Register from "./pages/Register";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/derivatives" element={<DerivativesMenu />} />
        <Route path="/derivatives/basic" element={<BasicDerivativesMenu />} />
        <Route path="/derivatives/:type" element={<DerivativeSolverPage />} />

        <Route path="/limits" element={<LimitsMenu />} />
        <Route path="/limits/:type" element={<LimitSolverPage />} />

        <Route path="/login-ranking" element={<LoginRanking />} />

        <Route path="/playlab" element={<PlayLabMenu />} />
        <Route path="/playlab/escape" element={<EscapeMathGame />} />
        <Route path="/playlab/puzzle" element={<PuzzleStepsGame />} />
        <Route path="/playlab/race" element={<MathRaceGame />} />
        <Route path="/playlab/battle" element={<MathBattleGame />} />
        <Route path="/quiz" element={<QuizLevelsPage />} />
        <Route path="/quiz/:topic" element={<QuizTopicLevelsPage />} />
        <Route path="/quiz/:topic/:level" element={<QuizPage />} />
        <Route path="/register" element={<Register />} />
                
        
      

        <Route
          path="/ranking"
          element={
            <ProtectedRoute>
              <Ranking />
            </ProtectedRoute>
          }

     

        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;