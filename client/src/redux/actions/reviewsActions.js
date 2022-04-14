import axios from "axios";
import {message} from "antd";

export const getAllReviews=()=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
        const response = await axios.get('/api/reviews/getallreviews')
        dispatch({type: 'GET_ALL_REVIEWS', payload:response.data})
        dispatch({type: 'LOADING' , payload:false})
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }

}

export const addReview=(reqObj)=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
        //const response= axios.post('/api/cars/addreview' , reqObj)
        await axios.post('/api/reviews/addreview' , reqObj)
        dispatch({type: 'LOADING' , payload:false})
        //dispatch({type: 'GET_ALL_REVIEWS', payload:response.data})
        message.success('New review added successfully')
        setTimeout(() => {
            window.location.href='/reviews'
        }, 500);
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }


}