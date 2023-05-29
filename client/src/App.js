import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import CreateJournal from './pages/CreateJournal.jsx';
import ViewJournal from './pages/ViewJournal.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import AuthRoute from './components/AuthRoute.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';

function App() {

  return (
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path='/login' element={
          <Login/>
        }/>
        <Route path='/' element={
          <AuthRoute>
            <Home/>
          </AuthRoute>
        }/>
        <Route path='/create' element={
          <AuthRoute>
            <CreateJournal/>
          </AuthRoute>
        }/>
        <Route path='/view/:id' element={
          <AuthRoute>
            <ViewJournal/>
          </AuthRoute>
        }/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;