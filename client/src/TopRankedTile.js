
import { ThemeContext } from "./App";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function TopRankedTile(props) {
    const navigate = useNavigate()
    const {theme, setTheme} = useContext(ThemeContext);
    const [hovered, setHovered] = useState(false);
    const stars = [];

    for (let i = 1; i <= props.rating; i++) {
        stars.push(<i className={"fa-solid fa-star"} key={i}></i>);
    }
    if (props.rating % 1 !== 0) {
        stars.push(<i className={"fa-solid fa-star-half"} key={0.5}></i>)
    }
    return (
        <div className={`${theme}Background`} onClick={(e) => navigate("/details/" + props.redirect)}  onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{borderRadius: "1vw", width: "30vw", cursor: "pointer", height: "22vw", margin: "1vw", position: "relative", padding: "3vw", textAlign: "left", transitionDuration: "0.1s", filter: (hovered? "drop-shadow(0 0.2vw 0.5vw rgba(0, 0, 0, 0.5))" : "")}}>
            <img src={props.image} className={"TopRankedImage"} style={{width: "100%", height:"14vw", objectFit: "cover", borderRadius: "1vw"}}></img>
            <h1 className={`TopRankedTitle ${theme}Text`}>{props.title}</h1>
            <span className={"TopRankedStars accentText"}>{stars}</span>
            <span className={`RankIndicator ${theme}Background2 ` + ((props.rank === 1)? "accentText" : `${theme}Text`)}>{props.rank}</span>
        </div>
    );
}

export default TopRankedTile;