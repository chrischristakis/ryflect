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
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import { lightTheme } from './utils/Constants.js';

function changeTheme(theme) {
  document.documentElement.style.setProperty('--primary-color', theme.primary);
  document.documentElement.style.setProperty('--primary-color-darker', theme.primaryDarker);
  document.documentElement.style.setProperty('--secondary-color', theme.secondary);
  document.documentElement.style.setProperty('--secondary-color-darker', theme.secondaryDarker);
  document.documentElement.style.setProperty('--tertiary-color', theme.tertiary);
  document.documentElement.style.setProperty('--tertiary-color-darker', theme.tertiaryDarker);
}

changeTheme(lightTheme);

function App() {
  return (
    <div id={ style.root }>
      <AuthProvider>
        <div className={style['navbar']}>
          <Navbar/>
        </div>
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
            <Route path='/privacy-policy' element={
                <PrivacyPolicy/>
            }/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
        <div className={style.footer}>
          <Footer/>
        </div>
      </AuthProvider>
      <ToastContainer hideProgressBar={true} autoClose={2950}/>
    </div>
  );
}

export default App;