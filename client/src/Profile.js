import { ThemeContext, AccountContext} from "./App";
import {useState, useContext, useEffect} from 'react';

function Profile() {
    const {account, setAccount} = useContext(AccountContext);
    const {theme} = useContext(ThemeContext);
    const [accountDetails, setAccountDetails] = useState({icon: null, email: "", username: ""})
    const [newIcon, setNewIcon] = useState(null)
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function submitIcon(e) {
        setSubmitting(true)
        const formData = new FormData();
        formData.append("file", newIcon);

        try {
            const imageData = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData,
            }).then((res) => res.json());
            if (imageData.error) {
                setNewIcon(null);
                setError("Unsupported file type.")
                setSubmitting(false)
            } else {
                const iconChangeDetails = {username: account.username, icon: imageData.link}
                const upload = await fetch("/api/changeIcon", 
                    {
                        method: "POST", 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(iconChangeDetails)
                    })
                const newAccount = {...account, icon: imageData.link}
                setAccount(newAccount)
                localStorage.setItem("account", JSON.stringify(newAccount))
                setSubmitting(false);
                setNewIcon(null);
            }
            
        } catch (error) {
            console.log(error);
        }
        
    }

    useEffect(()=> {
        if (account) {
            try {
                fetch("/api/getUser", {
                    method: "POST", 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username: account.username})
                })
                .then((res) => res.json()).then((data) => {
                    if (data.status == "error") {
                    } else {
                        setAccountDetails({icon: data.icon, email: data.email, username: data.username})
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }  
    }, [account])

    return (!account? <h1 className={`${theme}Text`}style={{marginTop: "40vh", fontFamily: "Barlow Condensed", fontSize: "10vh", fontWeight: "bold"}}>Please login</h1>:
        <div style={{marginTop: "10vh", display: "flex", height: "90vh", alignItems: "center"}}>
            <div style={{width: "55vw", display: "block"}}>
                <img src={newIcon? URL.createObjectURL(newIcon) : accountDetails.icon} style={{objectFit: "cover", width: "25vw", height: "25vw", borderRadius: "12.5vw"}}></img>
                
                {newIcon? 
                <>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <button className={`Button ${theme}Text ${theme}Background4`} style={{margin: "1vw", marginLeft: "auto"}} onClick={() => setNewIcon(null)}>Cancel</button>
                    <button className={`Button ${theme}Text accentBackground`} style={{margin: "1vw", marginRight: "auto", opacity: (submitting? "50%": "100%"), cursor: (submitting? "not-allowed":"pointer")}} onClick={submitIcon} disabled={submitting? true: false}>Submit</button>
                </div>
                </>
                :
                <>
                    <label htmlFor="imageUpload" className={`Button ${theme}Text ${theme}Background4`} style={{display: "block", margin: "auto", marginTop: "1vw"}}>Change Icon</label>
                    <input id="imageUpload" accept="image/*" type="file" style={{visibility: "hidden"}} onChange={(event) => {
                        setNewIcon(event.target.files[0]);
                    }}></input>
                </>
                }
                
                {error && <p className={`accentText RegError`}>{error}</p>}
            </div>
            <div className={`${theme}Text`} style={{textAlign: "left", width: "55vw"}}>
                <h1 style={{fontSize: "5vw", fontFamily: "Barlow Condensed", fontWeight: "bold"}}>{accountDetails.username}</h1>
                <h2 style={{fontSize: "2.3vw", fontFamily: "Verdana", fontWeight: "bold"}}>{accountDetails.email}</h2>
            </div>
        </div>
    )
}

export default Profile;