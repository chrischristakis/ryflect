import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CreatePage from './pages/CreatePage.jsx';
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
import ChangePassword from './pages/ChangePassword.jsx';
import FAQ from './pages/FAQ.jsx';
import Footer from './components/Footer.jsx';
import style from './App.module.css';

function App() {

  return (
    <div id={style.root}>
      <AuthProvider>
        <Navbar/>
        <div className={style.content}>
          <Routes>
            <Route path='/' element={
              <AuthRoute key='/' redirect={<Landing/>}>
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
              <AuthRoute key='/create' redirect={<Navigate to='/login'/>}>
                <CreatePage/>
              </AuthRoute>
            }/>
            <Route path='/view/:id' element={
              <AuthRoute key='/view/:id' redirect={<Navigate to='/login'/>}>
                <ViewJournal/>
              </AuthRoute>
            }/>
            <Route path='/change-password' element={
              <AuthRoute key='/change-password' redirect={<Navigate to='/login'/>}>
                <ChangePassword/>
              </AuthRoute>
            }/>
            <Route path='/faq' element={
                <FAQ/>
            }/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
        <div className={style.footer}>
          <Footer/>
        </div>
      </AuthProvider>
      <ToastContainer hideProgressBar={true} autoClose={3640}/>
    </div>
  );
}

export default App;