import Navbar from './Navbar';
import './App.css';
import { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home.js';
import Login from './Login.js';
import SignUp from './SignUp.js';
import Details from './Details.js';
import Add from './Add.js';
import List from './List.js';
import Profile from './Profile.js'

export const ThemeContext = createContext(null);
export const AccountContext = createContext(null);

function App() {

  // Contexts
  const [theme, setTheme] = useState('dark');
  const [account, setAccount] = useState(JSON.parse(localStorage.getItem("account")));

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  // Router and theme wrapper
  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <AccountContext.Provider value={{account, setAccount}}>
        <BrowserRouter>
          <div className={"App " + theme + "Background"}>
            <Navbar/>
            <Routes>
              <Route index element={<Home/>}/>
              <Route path="login" element={<Login/>}/>
              <Route path="signup" element={<SignUp/>}/>
              <Route path="details/:spotId" element={<Details/>}/>
              <Route path="add" element={<Add/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path="list/:search?" element={<List/>}/>
            </Routes>
            
          </div>
        </BrowserRouter>
      </AccountContext.Provider>
    </ThemeContext.Provider>
    
  );
}

export default App;
