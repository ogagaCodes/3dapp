import Canvas from "./canvas"
import Home from "./Pages/Home"
import Customisers from "./Pages/Customisers"

function App() {

  return (
    <main className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Customisers />
    </main>
  )
}

export default App
