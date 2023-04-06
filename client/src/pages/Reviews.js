// import React, {useContext, useState} from "react";
// import '../index.css'
//
// const ThemeContext = React.createContext();
//
// export function Reviews() {
//     const [themes, setThemes] = useState({
//         light: {
//             foreground: "#000000",
//             background: "#eeeeee"
//         }
//     })
//
//     return (
//         <ThemeContext.Provider value={{themes, setThemes}}>
//             <Toolbar/>
//         </ThemeContext.Provider>
//     );
// }
//
// function Toolbar(props) {
//
//     const {themes, setThemes} = useContext(ThemeContext);
//     return (
//         <button onClick={()=>{setThemes('light' in themes ?{dark: {foreground: "#ffffff", background:"#222222"}}:
//             {
//                 light: {
//                     foreground: "#000000",
//                     background: "#eeeeee"
//                 }
//             }
//         )}}
//                 style={'light' in themes ? {background: themes.light.background, color: themes.light.foreground}
//                 :{background: themes.dark.background, color: themes.dark.foreground}}>
//             Я стилизован темой из контекста!
//         </button>
//     );
// }
// const ThemeContext = React.createContext();
//
// export function Reviews() {
//     const [theme, setTheme] = useState('light')
//
//     return (
//         <ThemeContext.Provider value={{theme, setTheme}}>
//             <Toolbar/>
//         </ThemeContext.Provider>
//     );
// }

import React, {useEffect} from "react";
import DefaultLayout from "../components/DefaultLayout";
import {useDispatch, useSelector} from "react-redux";
import {getAllReviews} from "../redux/actions/reviewsActions";
import Spinner from "../components/Spinner";
import {Carousel, Col, Rate, Row} from "antd";

export function Reviews(props) {
    const {reviews} = useSelector(state => state.reviewsReducer)
    const dispatch = useDispatch()
    const {loading} = useSelector(state => state.alertsReducer)

    useEffect(() => {
        dispatch(getAllReviews())
    }, [])

    return (

        <DefaultLayout>
            <Row
                justify="center"
            >
                <Col lg={10} sm={24} xs={24} className='p-3'>
                    {loading && (<Spinner/>)}
                    <Carousel dotPosition={'left'}>
                        {reviews.map(review => {
                            return <div className="review p-2 ">
                                <p className={'usernameinreview'}>{review.user[0].username}</p>
                                <img className="carimgreview " src={review.car[0].image}/>
                                <p className={'carnameinreview'}>{review.car[0].name}</p>
                                <Rate disabled defaultValue={review.rating} />
                                <p className={'descriptioninreview'}>{review.description}</p>
                                {/*<p> Rent Per Hour {car.rentPerHour} /-</p>*/}
                            </div>
                        })}
                    </Carousel>
                    {reviews.length === 0 && <h1>No reviews found</h1>}
                </Col>
            </Row>
        </DefaultLayout>
    );
}
