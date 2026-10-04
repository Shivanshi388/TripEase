import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to TripEase</h1>
      <p>Plan your journey. Travel with ease.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;