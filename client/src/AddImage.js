import { useContext, memo } from "react";
import { ThemeContext } from "./App";

const AddImage = memo(function AddImage({image, setImage}) {
    const {theme} = useContext(ThemeContext);
    return (
        <div className={"UploadImageContainer"} style={{position: "relative", backgroundSize: "cover", backgroundImage: "url(" + URL.createObjectURL(image)+")"}}>
            <button onClick={(event) => setImage(null)} className={`UploadImageDelete ${theme}Background2`}><i className={`fa-solid fa-xmark ${theme}Text`}></i></button>
        </div>
    )
});

export default AddImage;