import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import DestinationPage from "./pages/DestinationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/destination/:id"
          element={<DestinationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;