import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import {
    findCarsInAddress,
    findCarsInCategory,
    getAllCars,
    getAllCategories,
    getAllLocations,
    getFilteredCars, getSavedCars
} from '../redux/actions/carsActions'
import {Col, Row, Divider, DatePicker, Form, Input, Slider, Select, Tooltip, Card, Space} from 'antd'
import Spinner from '../components/Spinner';
import moment from 'moment'
import {Option} from "antd/es/mentions";
import {Radio} from 'antd';

const {RangePicker} = DatePicker

function SavedCars() {
    const {savedCars} = useSelector(state => state.carsReducer)
    const {loading} = useSelector(state => state.alertsReducer)
    const [totalCars, setTotalcars] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSavedCars(JSON.parse(localStorage.getItem('userSaved'))))
        dispatch(getAllCategories());
        dispatch(getAllLocations());
        if (JSON.parse(localStorage.getItem('address'))) {
            localStorage.removeItem('address')
        }
    }, [])


    useEffect(() => {
        setTotalcars(savedCars)
    }, [savedCars])


    return (
        <DefaultLayout>
            <Row gutter={16} justify='center'>

                {loading == true && (<Spinner/>)}

                <Row justify='center' gutter={64}>
                    <Row className="mt-3 " justify='space-between'>
                    {totalCars&& totalCars.map(car => {
                        return <Col lg={5} sm={24} xs={24}>
                            <div className="car p-2 bs1">
                                <img src={car.image} className="carimg"/>

                                <div className="car-content d-flex align-items-center justify-content-between">

                                    <div className='text-left '>
                                        <p className={'carnameinhomepages'}>{car.name}</p>
                                        <p className={'rentPerHour'}> {car.rentPerHour} $/Hour</p>
                                    </div>

                                    <div>
                                        <button className="btn1 mr-1"><a className={'viewDetails'}
                                                                         href={`/booking/${car._id}`}>View details</a>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </Col>
                    })}
                    {!totalCars && <h1>You save no cars</h1>}

                </Row>
                    </Row>
            </Row>

        </DefaultLayout>

    )
}

export default SavedCars
