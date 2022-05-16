import { message } from 'antd';
import axios from 'axios';
import { saveAs } from 'file-saver'

export const getAllCars=()=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
        const response = await axios.get('/api/cars/getallcars')
        dispatch({type: 'GET_ALL_CARS', payload:response.data})
        dispatch({type: 'LOADING' , payload:false})
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }

}
export const getAllCategories=()=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
        const response = await axios.get('/api/cars/getallcategories')
        dispatch({type: 'GET_ALL_CATEGORIES', payload:response.data})
        dispatch({type: 'LOADING' , payload:false})
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }

}

export const getAllLocations=()=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
        const response = await axios.get('/api/cars/getalllocations')
        dispatch({type: 'GET_ALL_LOCATIONS', payload:response.data})
        dispatch({type: 'LOADING' , payload:false})
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }

}

export const findCarsInAddress=(values)=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
        const response = await axios.post('/api/cars/findcarsinaddress', values)
        dispatch({type: 'GET_FILTERED_CARS_IN_ADDRESS', payload:response.data})
        dispatch({type: 'LOADING' , payload:false})
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }

}


export const getFilteredCars=(values)=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
        const response = await axios.post('/api/cars/filter', values )
        dispatch({type: 'GET_FILTERED_CARS', payload:response.data})
        dispatch({type: 'LOADING' , payload:false})
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }

}


export const addCategory=(reqObj)=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
        await axios.post('/api/cars/addcategory' , reqObj)

        dispatch({type: 'LOADING' , payload:false})
        message.success('New category added successfully')
        setTimeout(() => {
            window.location.href='/admin'
        }, 500);
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }


}


export const addCar=(reqObj)=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
         await axios.post('/api/cars/addcar' , reqObj)
         .then(() => axios.get('/fetch-pdf', { responseType: 'blob' }))
             .then((res) => {
                 const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

                 saveAs(pdfBlob, 'newPdf.pdf');
             })
         setTimeout(() => {
            window.location.href='/admin'
         }, 1000);
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }
      

}

export const editCar=(reqObj)=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
         await axios.post('/api/cars/editcar' , reqObj)
       
         dispatch({type: 'LOADING' , payload:false})
         message.success('Car details updated successfully')
         setTimeout(() => {
            window.location.href='/admin'
         }, 500);
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }
      

}

export const deleteCar=(reqObj)=>async dispatch=>{

    dispatch({type: 'LOADING' , payload:true})

    try {
         await axios.post('/api/cars/deletecar' , reqObj)
       
         dispatch({type: 'LOADING' , payload:false})
         message.success('Car deleted successfully')
         setTimeout(() => {
            window.location.reload()
         }, 500);
    } catch (error) {
        console.log(error)
        dispatch({type: 'LOADING' , payload:false})
    }
      

}