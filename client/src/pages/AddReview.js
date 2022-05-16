import {Col, Row, Form, Input, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import Spinner from '../components/Spinner'
import {addCar, getAllCars} from '../redux/actions/carsActions'
import {Option} from "antd/es/mentions";
import {addReview} from "../redux/actions/reviewsActions";

function AddReview() {
    const {cars} = useSelector(state => state.carsReducer)
    const dispatch = useDispatch()
    const {loading} = useSelector(state => state.alertsReducer)
    const [totalCars, setTotalcars] = useState([])

    useEffect(() => {
        dispatch(getAllCars())
    }, [])

    useEffect(() => {
        setTotalcars(cars)
    }, [cars])

    let currentUser = JSON.parse(localStorage.getItem("user"))._id

    function onFinish(values) {
        let reviewObj = {...values, user: JSON.parse(localStorage.getItem("user"))._id}
        dispatch(addReview(reviewObj))
        console.log(reviewObj)
    }

    return (
        <DefaultLayout>
            {loading && (<Spinner/>)}
            <Row justify='center mt-5'>
                <Col lg={12} sm={24} xs={24} className='p-2'>
                    <Form className='bs1 p-2' layout='vertical' onFinish={onFinish}>
                        <h3>Add New Review</h3>
                        <hr/>
                        <Form.Item name='car' label='Car' rules={[{required: true}]}>
                            <Select style={{width: 120}}>
                                {totalCars.map(car => {
                                    return <>
                                        <Option value={car._id}>{car.name}</Option>
                                        {/*<img src={car.image} className="carimg"/>*/}
                                    </>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name='description' label='Description' rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>

                        <div className='text-right'>
                            <button className='btn1'> Add Review</button>
                        </div>

                    </Form>
                </Col>
            </Row>

        </DefaultLayout>
    )
}

export default AddReview
