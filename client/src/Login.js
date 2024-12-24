import { ThemeContext, AccountContext} from "./App";
import { useContext, useState} from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const {theme, setTheme} = useContext(ThemeContext);
    const {account, setAccount} = useContext(AccountContext);
    const [showPassword, setShowPassword] = useState("password");
    const [error, setError] = useState(null);
    const [registrationDetails, setRegistrationDetails] = useState({password: '', username: ''})
    const [submitting, setSubmitting] = useState(false);

    function toggleShowPassword(e) {
        setShowPassword((curr) => (curr === "password" ? "text" : "password"));
    }

    function detailsChanged(e) {
        setRegistrationDetails({...registrationDetails, [e.target.name]: e.target.value})
    }

    function loginAccount(e) {
        setSubmitting(true);
        try {
            fetch(`/api/accessUser`,
            {
                method: "Post", 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationDetails)
            })
            .then((res) => res.json()).then((data) => {
                if (data.status == "error") {
                    setError(data.message);
                    setSubmitting(false);
                } else {
                    setError(null);
                    const account = {username: data.account.username, email: data.account.email, password: data.account.password, icon: data.account.icon};
                    setAccount(account);
                    localStorage.setItem("account", JSON.stringify(account));
                    navigate("/");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={"RegPage"}>
            <div className={`RegContainer ${theme}Background2`}>
                <h1 className={`RegTitle ${theme}Text`}>Login</h1>
                <p className={`RegPrompt ${theme}Text2`}>Don't have an account? <span className={"accentText"} style={{cursor: "pointer"}} onClick={(event) => navigate("/signup")}>Sign up</span></p>
                <div className={`RegInputContainer ${theme}Background`}>
                    <span className={`RegLabel ${theme}Text2`}>Username</span>
                    <input name="username" value={registrationDetails.username || ''} onChange={detailsChanged} type="text" className={`RegInput ${theme}Text`}></input>
                </div>
                <div className={`RegInputContainer ${theme}Background`}>
                    <span className={`RegLabel ${theme}Text2`}>Password</span>
                    <button className={"ShowPasswordButton"}><i className={"fa-solid " + ((showPassword==="password")? "fa-eye" : "fa-eye-slash") + ` ${theme}Text`} onClick={toggleShowPassword}></i></button>
                    <input name="password" value={registrationDetails.password || ''} onChange={detailsChanged}  type={showPassword} className={`RegInput ${theme}Text`}></input>
                </div>
                {error && <p className={`RegError accentText`}>{error}</p>}
                <button className={`accentBackground ${theme}Text RegSubmitButton`} style={(submitting? {filter: "opacity(50%)", cursor: "not-allowed"}:{})} disabled={(submitting? true:false)} onClick={loginAccount}>Login</button>
            </div>
        </div>
        
    )
}

export default Login;
