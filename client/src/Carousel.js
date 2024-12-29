
import { useState, useContext } from "react";
import mathCnDImage from "./images/MathCnD.jpg";
import slcImage from "./images/SLC.jpg";
import dcLibImage from "./images/DCLib.jpg";
import { ThemeContext } from "./App";

// Image carousel for home page
function Carousel() {
    const[offset, setOffset] = useState(0);
    const[transitionDirection, setTransitionDirection] = useState("Right");
    const images = [mathCnDImage, slcImage, dcLibImage];
    const {theme, toggleTheme} = useContext(ThemeContext);

    // Slide current image
    function transitionRight (e) {
        setOffset(offset+1);
        setTransitionDirection("Right");
    }

    function transitionLeft (e) {
        setOffset(offset+2);
        setTransitionDirection("Left");
    }

    // HTML
    return (
        <div className={"Carousel"}>
            <div style={{position: "absolute", left: "12.5vw", width: "75vw", height: "30vw", overflow: "hidden", borderRadius: "1vw"}}>
                {images.map((item, idx) => {
                    return <img className={`CarouselImage  CarouselImage` + ((offset + idx) % 3) + ` CarouselImage${transitionDirection}`} src={item} alt="testImage" key={idx}></img>
                })}
            </div>
            
            <button onClick={transitionRight} className={`CarouselRight ${theme}Background2`}><i className={`fa-solid fa-chevron-right ${theme}Text`}></i></button>
            <button onClick={transitionLeft} className={`CarouselLeft ${theme}Background2`}><i className={`fa-solid fa-chevron-left ${theme}Text`}></i></button>
            {images.map((item, idx) => {
                return <span className={`${theme}Background3 CarouselIndicator CarouselIndicator${idx} CarouselIndicatorHighlight` + (idx - (offset % 3))}key={idx}></span>
            })}
        </div>
    );
}

export default Carousel;