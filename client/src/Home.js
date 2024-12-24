import Carousel from "./Carousel";
import TopRankedTile from './TopRankedTile.js'
import { ThemeContext } from "./App";
import { useContext, useEffect, useState} from "react";
import mathCnDImage from "./images/MathCnD.jpg";
import slcImage from "./images/SLC.jpg";
import dcLibImage from "./images/DCLib.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const {theme, setTheme} = useContext(ThemeContext);
    const [topSpots, setTopSpots] = useState([]);
    let topRedirects = ["", "", ""];

    useEffect(() => {
        try {
            fetch("/api/getTop")
            .then((res) => res.json()).then((data) => {
                setTopSpots(data);
            });
        } catch (error) {
            console.log(error);
        }
    }, [])
    return (
        <>
            <h1 className={`HomeTitle ${theme}Text`}>Where will you study today?</h1>
            <Carousel/>
            <h1 className={`HomeTitle ${theme}Text`}>Top Ranked</h1>
            <div className={"TopRankedContainer"} style={{width: "100vw", display: "flex", justifyContent: "center", marginBottom: "3vw"}}>
            {topSpots.map((item, idx) => {
                return <TopRankedTile image={item.icon} key={idx} redirect={item._id} rank={idx+1} rating={item.rating} title={item.title}/>
            })}
            </div>
            <button className={`ViewMoreButton accentBackground ${theme}Text`} onClick={(event) => navigate("/list")}>View More</button>
        </>
    )
    
}

export default Home;