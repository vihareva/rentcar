import React, {useState, useEffect} from "react";
import DefaultLayout from "../components/DefaultLayout";
import {useDispatch, useSelector} from "react-redux";
import {getAllBookings} from "../redux/actions/bookingActions";
import {Col, Row} from "antd";
import Spinner from '../components/Spinner';
import moment from "moment";

function UserBookings() {
    const dispatch = useDispatch();
    const {bookings} = useSelector((state) => state.bookingsReducer);
    const {loading} = useSelector((state) => state.alertsReducer);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        dispatch(getAllBookings());
    }, []);
    console.log(bookings)
    return (
        <DefaultLayout>
            {loading && (<Spinner/>)}
            <h3 className="text-center mt-2">My Bookings</h3>
            {bookings.filter(o => o.user == user._id).length ? <Row justify="center" gutter={16}>
                <Col lg={16} sm={24}>

                    {bookings.filter(o => o.user == user._id).map((booking) => {
                        return <Row gutter={16} className={moment(Date.now()).isAfter(moment(booking.bookedTimeSlots.to)) ? "bs1 mt-3 text-left nonactive" : "bs1 mt-3 text-left"}>
                            <Col lg={6} sm={24}>

                                <p><b>{booking.car.name}</b></p>
                                <p>Total hours : <b>{booking.totalHours}</b></p>
                                <p>Rent per hour : <b>{booking.car[0].rentPerHour}</b></p>
                                <p>Total amount : <b>{booking.totalAmount}</b></p>
                            </Col>

                            <Col lg={6} sm={24}>
                                <p>From: <b>{booking.bookedTimeSlots.from}</b></p>
                                <p>To: <b>{booking.bookedTimeSlots.to}</b></p>
                                <p>Date of booking: <b>{moment(booking.createdAt).format('MMM DD yyyy')}</b></p>
                            </Col>
                            <Col lg={6} sm={24}>
                                <img style={{borderRadius: 5}} src={booking.car[0].image} height="140" className="p-2"/>
                            </Col>
                            <Col lg={6} sm={24}
                                 style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>

                                <button disabled={ moment(Date.now()).isAfter(moment(booking.bookedTimeSlots.to))} className="btn1 mr-1">
                                    <a className={moment(Date.now()).isAfter(moment(booking.bookedTimeSlots.to)) ? 'viewDetails disabled':'viewDetails' }
                                                                 href={`/editbooking/${booking._id}`}>Edit booking</a>
                                </button>


                            </Col>
                        </Row>;
                    })}

                        </Col>
                        </Row>
                        : <div>There are no bookings</div>}

                </DefaultLayout>
                );
                }

export default UserBookings;
