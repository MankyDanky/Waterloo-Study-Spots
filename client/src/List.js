import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "./App";
import { useContext, useState, useEffect} from "react";
import testImage from "./images/test.jpg";

// Capitalize first letter of string function
function capitalizeFirst(s) {
    return s.at(0).toUpperCase() + s.slice(1);
}

// List of all spots page
function List(props) {
    const {search} = useParams();
    const navigate = useNavigate();
    const {theme} = useContext(ThemeContext)
    const [ratingFilter, setRatingFilter] = useState(0);
    const [tagFilter, setTagFilter] = useState("all")
    const [sidebarDisplayed, setSidebarDisplayed] = useState(true);
    const [tags, setTags] = useState([])
    const [spots, setSpots] = useState([])

    
    useEffect(()=> {
        // Get tags for sidebar
        try {
            fetch("/api/getTags")
            .then((res) => res.json()).then((data) => {
                if (data.status == "error") {
                } else {
                    setTags(data.tags.map((item, indx) => item.name));
                }
            });
        } catch (error) {
            console.log(error);
        }
        // Get all spots meeting filter criteria
        try {
            fetch("/api/getSpots?rating=" + ratingFilter + (tagFilter != "all"? "&tags=" + tagFilter:"") + (search? "&search=" + search : ""))
            .then((res) => res.json()).then((data) => {
                setSpots(data)
            })
        } catch (error) {
            console.log("Error while getting spots" + error)
        }
    }, [ratingFilter, tagFilter])

    // HTML
    return (
        <div style={{marginTop: "10vh", display: "flex", position: "relative"}}>
            <i className={`fa-solid fa-bars ${theme}Text`} style={{fontSize: "2vw", position: "absolute", left: "1vw", top: "1vw", cursor: "pointer"}} onClick={(event) => setSidebarDisplayed(true)}></i>
            <div className={`${theme}Background`} style={{width: "20vw", display: "block", padding: "2vw", paddingTop: "3vw", textAlign: "left", transitionDuration: "0.1s", position: "absolute", left: (sidebarDisplayed? "0vw" : "-25vw")}}>
                <h1 className={`ListSidebarHeader ${theme}Text`}>Rating</h1>
                {
                    [...Array(5).keys()].map((item, idx) => {
                        return <i className={((ratingFilter > idx)? "fa-solid" : "fa-regular") + " fa-star accentText"} key={idx} index={idx} style={{cursor: "pointer", fontSize: "1.6vw"}} onClick={(event) => setRatingFilter(idx + 1)}></i>
                    })
                }
                <div className={"ListSidebarDivider"}></div>
                <h1 className={`ListSidebarHeader ${theme}Text`}>Tags</h1>
                <span className={"ListSidebarTag " + ((tagFilter=="all")? "Selected" : "")} onClick={(event) => {setTagFilter("all")}}>All</span>
                {
                    tags.map((item, idx) => {
                        return <span key={idx} className={"ListSidebarTag " + ((tagFilter==item)? "Selected" : "")} onClick={(event) => {setTagFilter(item)}}>{capitalizeFirst(item)}</span>
                    })
                }
                <i onClick={(event) => setSidebarDisplayed(false)} className={`fa-solid fa-xmark ${theme}Text`} style={{fontSize: "2vw", cursor: "pointer", position: 'absolute', right: "1vw", top: "1vw"}}></i>
            </div>
            <div style={{transitionDuration: "0.1s", width: (sidebarDisplayed? "75vw": "96vw"), height: "90vh", marginLeft: (sidebarDisplayed? "25vw": "4vw")}}>
                {
                    spots.map((item, idx) => {
                        return <div className={`${theme}Background ListItemContainer`} key={idx} onClick={(event) => navigate(`/details/${item._id}`)}>
                            <img src={item.icon} style={{height: "15vw", width: "25vw", marginLeft: "1vw", objectFit: "cover", borderRadius: "1vw"}}></img>
                            <div style={{display: "block", marginLeft: "2vw", marginTop: "0.1vw", textAlign: "left"}}>
                                <h1 style={{ margin: "0", fontSize: "2vw", fontWeight: "bold", fontFamily: "Barlow Condensed"}} className={`${theme}Text`}>{item.title}</h1>
                                {
                                    
                                    [...Array((item.rating - item.rating%1)).keys()].map((starIndex, idx) => {
                                        return <i className={"fa-solid fa-star accentText"} style={{fontSize: "1.4vw", marginTop: "1vw"}} key={starIndex}></i>
                                    })
                                }
                                {
                                    (item.rating % 1 !== 0) && <i className={"fa-solid fa-star-half accentText"} style={{fontSize: "1.4vw"}}></i>
                                }
                                <p className={`${theme}Text`} style={{fontSize: "1vw", fontFamily: "Verdana"}}>{item.description}</p>
                                {
                                    item.tags.map((item, idx) => {
                                        return <span key={idx} className={`${theme}Text ${theme}Background4 ListItemTag`}>{capitalizeFirst(item)}</span>
                                    })
                                }
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default List;