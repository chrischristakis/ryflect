import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CreateJournal from './pages/CreateJournal.jsx';
import ViewJournal from './pages/ViewJournal.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import { AuthRoute } from './components/Routes.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Home from './pages/Home.jsx';
import Landing from './pages/Landing.jsx';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path='/' element={
            <AuthRoute redirect={<Landing/>}>
              <Home/>
            </AuthRoute>
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
            <AuthRoute redirect={<Navigate to='/login'/>}>
              <CreateJournal/>
            </AuthRoute>
          }/>
          <Route path='/view/:id' element={
            <AuthRoute redirect={<Navigate to='/login'/>}>
              <ViewJournal/>
            </AuthRoute>
          }/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </AuthProvider>
      <ToastContainer hideProgressBar={true} autoClose={3640}/>
    </>
  );
}

export default App;