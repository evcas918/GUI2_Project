import NavBar from './NavBar'
import Footer from './Footer'
import FullBanner from './FullBanner'
import AddButton from './AddButton'

function App() {
  return (
    <>
      <FullBanner/>
      <div id="NavBar"><NavBar/></div>
      <AddButton/>
      <Footer/>
    </>
  );
}

export default App