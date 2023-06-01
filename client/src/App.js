import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CreateJournal from './pages/CreateJournal.jsx';
import ViewJournal from './pages/ViewJournal.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import {AuthRoute, HomeLandingSelector} from './components/Routes.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

function App() {

  return (
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path='/' element={
          <HomeLandingSelector/>
        }/>
        <Route path='/login' element={
          <Login/>
        }/>
        <Route path='/register' element={
          <Register/>
        }/>
        <Route path='/verify/:id' element={
          <VerifyEmail/>
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