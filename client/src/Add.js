import { ThemeContext, AccountContext } from "./App";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddImage from "./AddImage";


function Add() {
    const {account} = useContext(AccountContext);
    const navigate = useNavigate();
    const {theme} = useContext(ThemeContext);
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false);

    async function submitSpot(e) {
        setSubmitting(true)
        const formData = new FormData();
        formData.append("file", image);

        try {
            const imageData = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData,
            }).then((res) => res.json());
            if (imageData.error) {
                setImage(null);
                setError("Unsupported file type.")
                setSubmitting(false)
            } else {
                const spotDetails = {title: title, description: description, tags: tags, image: imageData.link}
                const upload = await fetch("/api/addSpot", 
                    {
                        method: "POST", 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(spotDetails)
                    })
                console.log(upload.json());
                navigate("/list");
            }
            
        } catch (error) {
            console.log(error);
        }
        
    }

    function TagInputChanged(event) {
        const input = event.target.value;
        const lastChar = input.split('').pop()
        if (lastChar === ' ' || lastChar === '\n') {
            const newTag = input.substr(0, input.length - 1).toLowerCase();
            if (tags.length < 5 && !tags.includes(newTag)) {
                setTags([...tags, newTag])
            }
            event.target.value = "";
        }
    }
    
    function TagCancelClicked(event) {
        const index = event.target.getAttribute("index");
        const element = tags.at(index);
        setTags(tags.filter(a => a !== element));
    }

    return ( !account? <h1 className={`${theme}Text`}style={{marginTop: "40vh", fontFamily: "Barlow Condensed", fontSize: "10vh", fontWeight: "bold"}}>Please login</h1>:
        <div style={{marginTop: "10vh"}}>
            <div style={{width: "92vw", margin: "4vw", marginBottom: "1vw",  height: "34vw", display: "flex", paddingTop: "2vw"}}>
                {!image && (
                    <>
                        <div className={"UploadImageContainer DashedBorder"} style={{position: "relative"}}>
                            <i className={`fa-solid fa-upload ${theme}Text3`} style={{fontSize: "6vw", marginTop: "11vw"}}></i>
                            <label htmlFor="imageUpload" className={`Button ${theme}Background4 ${theme}Text`} style={{display: "block", margin: "auto", marginTop: "2vw", width: "12vw"}}>Upload Image</label>
                            <input id="imageUpload" accept="image/*" type="file" style={{visibility: "hidden"}} onChange={(event) => {
                                setImage(event.target.files[0]);
                                setError(null)
                            }}></input>
                            {error && <p className={`accentText RegError`}>{error}</p>}
                        </div>
                    </>
                )}
                {image && (
                    <AddImage image={image} setImage={setImage}/>
                )}
                
                <div style={{postion: "relative", width: "43vw", height: "32vw", margin: "1vw", borderRadius: "1vw"}}>
                    <div className={`RegInputContainer ${theme}Background4`}>
                        <span className={`RegLabel ${theme}Text2`}>Title</span>
                        <input name="title" value={title || ""} onChange={(event) => setTitle(event.target.value)} type="text" className={`RegInput ${theme}Text`}></input>
                    </div>
                    <div className={`RegTextAreaContainer ${theme}Background4`}>
                        <span className={`RegLabel ${theme}Text2`}>Description</span>
                        <textarea name="description" value={description || ""} onChange={(event) => setDescription(event.target.value)} type="text" className={`RegInput ${theme}Text`} style={{resize: "none"}}></textarea>
                    </div>
                    <div className={`RegTagContainer ${theme}Background4`}>
                        <span className={`RegLabel ${theme}Text2`}>Tags</span>
                        {
                            tags.map((item, idx) => {
                                return <span key={idx} className={`TagContainer ${theme}Background5 ${theme}Text3`}>
                                    {item}
                                    <i index={idx} onClick={TagCancelClicked} style={{cursor: "pointer", boxSizing: "border-box", marginLeft: "1vw", fontSize: "1.1vw"}} className={"fa-solid fa-xmark"}></i>
                                </span>
                            })
                        }
                        <textarea type="text" onChange={TagInputChanged} className={`RegInput ${theme}Text`} style={{resize: "none"}}></textarea>
                    </div>
                </div>
            </div>
            <button className={`Button ${theme}Background4 ${theme}Text`} style={{display: "inline", margin: "2vw", marginTop: "1vw"}} onClick={() => navigate("/list")}>Cancel</button>
            <button className={`Button accentBackground ${theme}Text`} style={{display: "inline", margin: "2vw", marginTop: "1vw", cursor: (image && description && title && !submitting)? "pointer": "not-allowed", filter: (image && description && title && !submitting)? "none": "opacity(50%)"}} disabled={(image && description && title && !submitting)? false:true} onClick={submitSpot}>Submit</button>
        </div>
    );
}

export default Add;