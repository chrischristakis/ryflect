import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import CreateJournal from './pages/CreateJournal.jsx';
import ViewJournal from './pages/ViewJournal.jsx';

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create' element={<CreateJournal/>}/>
        <Route path='/view/:id' element={<ViewJournal/>}/>
      </Routes>
    </>
  );
}

export default App;