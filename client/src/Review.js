import { ThemeContext, AccountContext } from "./App";
import { useContext, useState, useEffect } from "react";

function Review(props) {
    const {theme} = useContext(ThemeContext)
    const {account} = useContext(AccountContext)
    const [icon, setIcon] = useState(null);

    function deleteReview() {
        try {
            fetch("/api/deleteReview", {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: props.username, spotId: props.spotId})
            }).then((res) => {
                props.effect();
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        try {
            fetch("/api/getUser", {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: props.username})
            })
            .then((res) => res.json()).then((data) => {
                if (data.status == "error") {
                } else {
                    setIcon(data.icon)
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
        <div style={{ display: "flex", width: "100vw", height: "10vw", paddingLeft: "6vw", paddingRight: "10vw", boxSizing: "border-box", marginTop: "4vw"}}>
            <img src={icon} style={{objectFit: "cover", height: "4vw", width: "4vw",borderRadius: "3.5vw", marginBottom: "6vw", boxSizing: "border-box"}}></img>
            <div style={{width: "70vw", height: "100%", textAlign: "left", paddingLeft: "2vw", display: "block"}}>
                <div style={{ display: "flex"}}> 
                    <h1 className={`${theme}Text`} style={{margin: "0", paddingRight: "2vw", fontFamily: "Verdana", fontWeight: "bold", fontSize: "1.2vw"}}>{props.username}</h1>
                    {
                        [...Array(props.rating).keys()].map((item, idx) => {
                            return <i className={"fa-solid fa-star accentText"} style={{fontSize: "1.4vw"}} key={item}></i>
                        })
                    }
                </div>
                <p className={`${theme}Text`} style={{fontSize: "1.1vw", fontFamily: "Verdana"}}>
                    {props.review}
                </p>
            </div>
            {account && account.username == props.username && <i className={`fa-solid fa-trash ${theme}Text`} style={{cursor: "pointer", fontSize: "1.4vw", marginLeft: "auto"}} onClick={deleteReview}></i>}
        </div>
    )
}

export default Review;