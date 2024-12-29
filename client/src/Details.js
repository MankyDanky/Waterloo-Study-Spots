import { useContext, useState, useEffect} from "react";
import { ThemeContext, AccountContext } from "./App";
import testImage from "./images/test.jpg"
import profileImage from "./images/profile.webp";
import {useParams} from 'react-router-dom';
import Review from "./Review";

// Spot details page
function Details() {
    const {spotId} = useParams()
    const [tags, setTags] = useState([])
    const [rating, setRating] = useState(0);
    const {theme} = useContext(ThemeContext)
    const [reviewRating, setReviewRating] = useState(0);
    const [review, setReview] = useState("")
    const [reviews, setReviews] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState(null)
    const {account, setAccount} = useContext(AccountContext)

    // Get whether the spot has already been reviewed by user
    function Reviewed() {
        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].username == account.username) {
                return true
            }
        }
        return false
    }

    // Add review
    function AddReview(e) {
        const reviewDetails = {username: account.username, review: review, rating: reviewRating, spotId: spotId}
        try {
            fetch(`/api/addReview`,
            {
                method: "Post", 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewDetails)
            }).then((res) => {
                effect()
            })
        } catch (error) {
            console.log(error);
        }
    }

    // Update spot information
    function effect() {
        try {
            fetch("/api/getSpot?id=" + spotId)
            .then((res) => res.json()).then((data) => {
                setRating(data[0].rating);
                setTags(data[0].tags);
                setReviews(data[0].reviews);
                setIcon(data[0].icon);
                setTitle(data[0].title);
                setDescription(data[0].description);
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(effect, [])

    function updateReviewRating(e) {
        setReviewRating(Number(e.target.getAttribute('index')) + 1);
    }

    // Star components
    const stars = [];
    for (let i = 1; i <= rating; i++) {
        stars.push(<i className={"fa-solid fa-star"} key={i}></i>);
    }
    if (rating % 1 !== 0) {
        stars.push(<i className={"fa-solid fa-star-half"} key={0.5}></i>)
    }

    const reviewStars = [];
    for (let i = 0; i < 5; i++) {
        reviewStars.push(<i className={((reviewRating > i)? "fa-solid" : "fa-regular") + " fa-star"} key={i} index={i} style={{cursor: "pointer"}} onClick={updateReviewRating}></i>)
    }

    // HTML
    return (
        <>
            <div style={{display: "flex", width: "100vw", height: "25vw", marginTop: "10vh", textAlign: "left", alignItems: "center", paddingTop: "2.5vw", paddingBottom: "2.5vw", boxSizing: "border-box"}}>
                <img src={icon} style={{minWidth: "45vw", height: "100%", marginLeft: "2.5vw", marginRight: "2.5vw", borderRadius: "1vw", float: "left", objectFit: "cover"}}></img>
                <div style={{display: "blocks", height: "100%"}}>
                    <h1 className={`${theme}Text DetailsTitle`}>{title}</h1>
                    <div className={"accentText"} style={{paddingTop: "0.5vw", paddingBottom: "0.5vw", fontSize: "1.2vw"}}>{stars}</div>
                    <p className={`${theme}Text DetailsDescription`}>{description}</p>
                    {tags.map((item, idx) => {
                        return <span key={idx} className={`${theme}Text ${theme}Background4 DescriptionTag`}>{item}</span>
                    })}
                </div>
            </div>
            <h1 className={`HomeTitle ${theme}Text`}>Reviews</h1>
            {account && !Reviewed() && 
                <div style={{display: "flex", width: "100vw", height: "10vw", paddingLeft: "6vw", paddingRight: "10vw", boxSizing: "border-box"}}>
                    <img src={account.icon} style={{borderRadius: "3.5vw", marginBottom: "6vw", boxSizing: "border-box"}}></img>
                    <div style={{ width: "100%", height: "100%", textAlign: "left", paddingLeft: "2vw"}}>
                        <input className={`ReviewInput ${theme}Text ${theme}Text2Placeholder`} type="text"  value={review || ""} onChange={(e) => setReview(e.target.value)} placeholder="Add a review"></input>
                        <div style={{display: "inline-block", width: "77vw", marginTop: "1.5vw"}}>
                            <span style={{fontSize: "1.4vw"}} className={"accentText"}>{reviewStars}</span>
                            <button style={{float: "right", opacity: (review? "100%": "50%"), cursor: (review? "pointer":"not-allowed")}} disabled={(review? false : true)} className={`Button accentBackground ${theme}Text`} onClick={AddReview}>Add</button>
                        </div>
                    </div>
                </div>
            }
            
            {reviews.map((item, idx) => {
                return <Review key={idx} effect={effect} spotId={spotId} username={item.username} review={item.review} rating={item.rating}/>
            })}
        </>
    );
}

export default Details;