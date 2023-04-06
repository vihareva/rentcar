import {Col, Form, Input, Rate, Row, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import Spinner from '../components/Spinner'
import {Option} from "antd/es/mentions";
import {addReview} from "../redux/actions/reviewsActions";
import {getAllBookings} from "../redux/actions/bookingActions";

function AddReview({match}) {
    const {bookings} = useSelector(state => state.bookingsReducer)
    const dispatch = useDispatch()
    const {loading} = useSelector(state => state.alertsReducer)
    const [booking, setbooking] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        dispatch(getAllBookings())
    }, [])

    useEffect(() => {

        if (bookings.length == 0) {
            dispatch(getAllBookings());
        } else {
            setbooking(bookings.find((o) => o._id == match.params.bookingid));
        }
        console.log(booking)
    }, [bookings]);

    console.log(bookings, "sfsdf")

    function onFinish(values) {
        let reviewObj = {
            ...values,
            user: JSON.parse(localStorage.getItem("user"))._id,
            booking: booking._id,
            car: booking.car[0]._id
        }
        dispatch(addReview(reviewObj))
        console.log(reviewObj)
    }

    return (
        <DefaultLayout>
            {loading && (<Spinner/>)}
            {Object.keys(booking).length!==0 ?
            <Row justify='center mt-5'>
                <Col lg={12} sm={24} xs={24} className='p-2'>
                    <Form className='bs1 p-2' layout='vertical' onFinish={onFinish}>
                        <h3>Add New Review</h3>
                        <hr/>
                        <p className={'carnameinhomepages'}>{booking.car[0].name}</p>
                        <div>
                            <img src={booking.car[0].image} className="carimg2 bs1 "/>
                        </div>
                        <Form.Item name='rating' label='Rating' rules={[{required: true}]}>
                            <Rate />
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
                : <div> You've had no booked cars to add a review  </div>}
        </DefaultLayout>
    )
}

export default AddReview
