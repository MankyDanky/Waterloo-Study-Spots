import { useContext, useState, useRef, useEffect} from "react";
import { ThemeContext, AccountContext} from "./App";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const {theme, toggleTheme} = useContext(ThemeContext);
    const {account, setAccount} = useContext(AccountContext);
    const [searching, setSearching] = useState(false);
    const [query, setQuery] = useState("")
    const [accountDisplayed, setAccountDisplayed] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const accountWindowRef = useRef(null)
    const [searchNames, setSearchNames] = useState([])
    
    useEffect(() => {
        document.addEventListener("click", handleClick, true)

        try {
            fetch("/api/getSpots")
            .then((res) => res.json()).then((data) => {
                let newSearchNames = []
                for (let i = 0; i < data.length; i++) {
                    newSearchNames.push(data[i].title);
                }
                setSearchNames(newSearchNames);
            });
        } catch (error) {
            console.log(error);
        }
    }, [])

    function handleClick (e) {
        if (!accountWindowRef.current.contains(e.target)) {
            setAccountDisplayed(false);
        }
    }

    function signOut (e) {
        navigate("/");
        setAccount(null);
        setAccountDisplayed(false);
        localStorage.removeItem("account");
    }

    function searchbarChanged(e) {
        let results = []
        setQuery(e.target.value);
        if (e.target.value !== "") {
            for (let i = 0; i < searchNames.length; i++) {
                if (searchNames[i].toLowerCase().startsWith(e.target.value.toLowerCase())) {
                    results.push(searchNames[i])
                }
            }
            setSearching(true);
        } else {
            setSearching(false);
        }
        setSearchResults(results);
        
    }

    return (
        <div className={`Navbar ${theme}Background2`}>
            <a className={"LogoButton accentText"} onClick={() => {
                navigate("/list");
                window.location.reload();
            }}>WSS</a>
            <div className={`Searchbar ${theme}Background ${theme}Text2`}>
                <i className={`fa-solid fa-magnifying-glass ${theme}Text`} style={{fontSize: "3vh", verticalAlign: "middle"}}></i>
                <input value={query} type="text" placeholder="Study spot name" className={`SearchbarInput ${theme}FocusText ${theme}Text2Placeholder`} onBlur={() => {
                    window.setTimeout(() => {
                        setSearching(false)
                    }, 100)
                }} onFocus={() => query && setSearching(true)} onInput={searchbarChanged} onKeyUp={(e) => {
                    if (e.key == "Enter") {
                        navigate("/list/" + query)
                        window.location.reload()
                    }
                }}></input>
                {searching && <button className={"SearchbarClearButton"} onClick={(e) => {
                    setQuery("")
                    setSearching(false)
                    }}><i  className={`SearchbarClearButton fa-solid fa-xmark ${theme}Text`} style={{fontSize: "3vh", verticalAlign: "middle"}}></i></button>}
            </div>
            {searching && searchResults.length > 0 && <div className={`${theme}Background4 SearchResults`}>
                <ul style={{textAlign: "left", listStyleType: "none", padding: "0", paddingTop: "1vh", paddingBottom: "1vh"}}>
                    {
                        searchResults.map((name, idx) => {
                            return <li className={`${theme}Text SearchResult`} key={idx} onClick={() => {
                                navigate("/list/" + name)
                                window.location.reload()
                            }}><i className={`fa-solid fa-magnifying-glass ${theme}Text`} style={{fontSize: "3vh", marginLeft: "2vh", marginRight: "1vh", verticalAlign: "middle"}}></i>{name}</li>
                        })
                    }
                </ul>
            </div>}
            {(!account && !window.location.href.endsWith("login")) && <a className={`NavbarButton ${theme}Text accentBackground`} style={{marginRight: "4vh"}} onClick={(event) => navigate("/login")}>Login</a>}
            {account && 
                <>
                    {!window.location.href.endsWith("add") && <a className={`NavbarButton ${theme}Text accentBackground`} onClick={(event) => navigate("/add")}>Add Spot</a>}
                    <img src={account.icon} className={"NavbarProfileIcon"} onClick={() => setAccountDisplayed(true)}></img>
                </>
            }
            <div ref={accountWindowRef} className={`${theme}Background4`} style={{ textAlign: "left", position: "fixed", width: "25vh", right: "2vh", top: "8.5vh", borderRadius: "2vh", overflow: "hidden", display: (accountDisplayed? "block":"none")}}>
                <div className={`${theme}Text ${theme}Background4 AccountWindowButton`} onClick={signOut}>
                    <i className={`fa-solid fa-right-from-bracket `}></i>
                    <p style={{display: "inline"}}> Sign out</p>
                </div>
                {!window.location.href.endsWith("profile") &&
                <div className={`${theme}Text ${theme}Background4 AccountWindowButton`} onClick={() => {
                    navigate("/profile");
                    setAccountDisplayed(false);
                    }}>
                    <i className={`fa-solid fa-user`}></i>
                    <p style={{display: "inline"}}> View profile</p>
                </div>
                }
               
            </div>
        </div>
    );
}

export default Navbar;