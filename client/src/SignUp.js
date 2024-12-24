import { ThemeContext, AccountContext} from "./App";
import { useContext, useState} from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const {account, setAccount} = useContext(AccountContext);
    const {theme, setTheme} = useContext(ThemeContext);
    const [showPassword, setShowPassword] = useState("password");
    const [error, setError] = useState(null);
    const [registrationDetails, setRegistrationDetails] = useState({password: '', username: '', confirmPassword: '', email: ''})
    const [submitting, setSubmitting] = useState(false);

    function toggleShowPassword(e) {
        setShowPassword((curr) => (curr === "password" ? "text" : "password"));
    }
    function detailsChanged(e) {
        setRegistrationDetails({...registrationDetails, [e.target.name]: e.target.value})
    }

    function registerAccount(e) {
        setSubmitting(true);
        try {
            fetch(`/api/createUser`, 
            {
                method: "POST", 
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
                    const account = {username: registrationDetails.username, email: registrationDetails.email, password: registrationDetails.password, icon: "https://i.imgur.com/s7lkvLq.jpg"};
                    setAccount(account);
                    navigate("/");
                    localStorage.setItem("account", JSON.stringify(account));
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    
    return (
        <div className={"RegPage"}>
            <div className={`RegContainer ${theme}Background2`}>
                <h1 className={`RegTitle ${theme}Text`}>Sign Up</h1>
                <p className={`RegPrompt ${theme}Text2`}>Already have an account? <span className={"accentText"} style={{cursor: "pointer"}} onClick={(e) => navigate("/login")}>Login</span></p>
                <div className={`RegInputContainer ${theme}Background`}>
                    <span className={`RegLabel ${theme}Text2`}>Username</span>
                    <input name="username" value={registrationDetails.username || ''} onChange={detailsChanged} type="text" className={`RegInput ${theme}Text`}></input>
                </div>
                <div className={`RegInputContainer ${theme}Background`}>
                    <span className={`RegLabel ${theme}Text2`}>Email</span>
                    <input name="email" value={registrationDetails.email || ''} onChange={detailsChanged} type="text" className={`RegInput ${theme}Text `}></input>
                </div>
                <div className={`RegInputContainer ${theme}Background`}>
                    <span className={`RegLabel ${theme}Text2`}>Password</span>
                    <button className={"ShowPasswordButton"}><i className={"fa-solid " + ((showPassword==="password")? "fa-eye" : "fa-eye-slash") + ` ${theme}Text`} onClick={toggleShowPassword}></i></button>
                    <input name="password" value={registrationDetails.password || ''} onChange={detailsChanged} type={showPassword} className={`RegInput ${theme}Text`}></input>
                </div>
                <div className={`RegInputContainer ${theme}Background`}>
                    <span className={`RegLabel ${theme}Text2`}>Confirm Password</span>
                    <input name="confirmPassword" value={registrationDetails.confirmPassword || ''} onChange={detailsChanged} type={showPassword} className={`RegInput ${theme}Text`}></input>
                </div>
                {error && <p className={`RegError accentText`}>{error}</p>}
                <button className={`accentBackground ${theme}Text RegSubmitButton`} style={(submitting? {filter: "opacity(50%)", cursor: "not-allowed"}:{})} disabled={(submitting? true:false)} onClick={registerAccount}>Sign Up</button>
                
            </div>
        </div>
        
    )
}

export default SignUp;
