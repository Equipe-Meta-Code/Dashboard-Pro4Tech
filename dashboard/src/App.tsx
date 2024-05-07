import { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';

//modo claro e escuro
import { ThemeContext} from './context/ThemeContext';
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";


function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <button type='button' className='theme-toggle-btn' onClick={toggleTheme}>
          <img className='theme-icon' src={theme === LIGHT_THEME ? SunIcon : MoonIcon}/>
        </button>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;