import React, {useEffect, useState} from "react";
import {editCar, getAllCars} from "../redux/actions/carsActions";
import {useDispatch, useSelector} from "react-redux";
import DefaultLayout from "../components/DefaultLayout";

import {Col, Row, Divider, Popover, Modal, Form, Input, InputNumber} from "antd";
import Spinner from "../components/Spinner";
import StripeCheckout from "react-stripe-checkout";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import {bookCar, editBooking, getAllBookings} from "../redux/actions/bookingActions";
import moment from "moment";

function EditBooking({match}) {
    const dispatch = useDispatch();
    const {bookings} = useSelector((state) => state.bookingsReducer);
    const [booking, setbooking] = useState({});
    const [daysAmount, setDaysAmount] = useState(undefined);
    const {loading} = useSelector((state) => state.alertsReducer);
    const [showModal, setShowModal] = useState(false);
    const [showModalErrorDates, setShowModalErrorDates] = useState(false);
    const [showModalExtend, setShowModalExtend] = useState(false);
    const {savedCarsIds} = useSelector((state) => state.carsReducer);
    const [totalHours, setTotalHours] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [driver, setdriver] = useState(false);

    useEffect(() => {

        if (bookings.length == 0) {
            dispatch(getAllBookings());
        } else {
            setbooking(bookings.find((o) => o._id == match.params.bookingid));
        }
        console.log(booking)
    }, [bookings]);
    //console.log(car)


    useEffect(() => {
        if(Object.keys(booking).length!==0){
            setTotalAmount(totalHours * booking.car[0].rentPerHour);
        }


    }, [ totalHours]);

    function onFinish(values) {
        // values._id = car._id;
        //
        // dispatch(editCar(values));

        setDaysAmount(Number(values.daysAmount))
        setTotalHours(Number(values.daysAmount)*24);

       // console.log(daysamount);
        setShowModalExtend(false)
    }

    // let addToSaved = () => {
    //     dispatch({type: 'ADD-SAVED-CAR-ID', payload: match.params.carid})
    // }

    function onToken(token) {

        const reqObj = {
            token,
            user: JSON.parse(localStorage.getItem("user"))._id,
            car: booking.car[0]._id,
            bookingId: booking._id,
            totalHours,
            totalAmount,
            driverRequired: driver,
            bookedTimeSlots: {
                from:booking.bookedTimeSlots.from,
                to:moment(booking.bookedTimeSlots.to).add(daysAmount, 'days').format("MMM DD yyyy HH:mm")
            },
        };
        console.log(reqObj)
        dispatch(editBooking(reqObj));
    }

    return(

        <DefaultLayout>
            {loading && <Spinner/>}
                {Object.keys(booking).length!==0 &&
                        <Row
                            justify="center"
                            className="d-flex align-items-center"
                            style={{minHeight: "90vh"}}
                        >
                            <Col lg={10} sm={24} xs={24} className='p-3'>


                                <div>
                                    <img src={booking.car[0].image} className="carimg2 bs1 w-100"/>
                                </div>

                                {booking.carAddress[0] && <div>
                                    <p><b>Address: </b>{booking.carAddress[0].city}, {booking.carAddress[0].country}</p>
                                    <p>{booking.carAddress[0].street}</p>
                                </div>}
                                {/*<button className="btn1 mt-2" onClick={addToSaved}>*/}
                                {/*    { savedCarsIds.some(c=>c===match.params.carid)? <HeartFilled/>: <HeartOutlined/> }*/}
                                {/*</button>*/}
                                {/*<img src={car.image} className="carimg2 bs1 w-100" data-aos='flip-left' data-aos-duration='1500'/>*/}
                            </Col>

                            <Col lg={10} sm={24} xs={24} className="text-right">
                                <Divider type="horizontal" dashed>
                                    Car Info
                                </Divider>
                                <div style={{textAlign: "right"}}>
                                    <p className={'carnameinhomepages'}>{booking.car[0].name}</p>
                                    <p className={'rentPerHour'}>{booking.car[0].rentPerHour} $ Per hour /-</p>
                                    {booking.car.category && <Popover overlayStyle={{width: "20vw"}}
                                                                      placement="bottom"
                                                                      title={booking.car[0].category[0].category}
                                                                      content={booking.car[0].category[0].description}>
                                        <p><span className={'headerSpan'}><b>Category :</b></span> <b>{booking.car.category[0].category}</b>
                                        </p>
                                    </Popover>}

                                    <p><span className={'headerSpan'}>Fuel Type :</span> {booking.car[0].fuelType}</p>
                                    <p><span className={'headerSpan'}>Transmission :</span> {booking.car[0].transmission}</p>
                                    <p><span className={'headerSpan'}>Max Persons :</span> {booking.car[0].capacity}</p>
                                    <p><span className={'headerSpan'}>Engine Capacity :</span> {booking.car[0].engineCapacity}</p>
                                </div>

                                <Divider type="horizontal" dashed>
                                    Select Time Slots
                                </Divider>
                                <button
                                    className="btn1 mt-2"
                                    onClick={() => {
                                        setShowModalExtend(true);
                                    }}
                                >
                                    Choose days to extend
                                </button>

                                <br/>
                                <button
                                    className="btn1 mt-2"
                                    onClick={() => {
                                        setShowModal(true);
                                    }}
                                >
                                    See Booked Slots
                                </button>
                                {daysAmount && (
                                    <div>
                                            <p>
                                                Total Hours : <b>{totalHours}</b>
                                            </p>
                                            <p>
                                                Rent Per Hour : <b>{booking.car[0].rentPerHour} $</b>
                                            </p>
                                        <h3>Total Amount : {totalAmount} $</h3>
                                        <StripeCheckout
                                            shippingAddress
                                            token={onToken}
                                            currency='USD'
                                            amount={totalAmount}
                                            stripeKey="pk_test_51KZNyDGfonS0kOfXU7atqutGlXnXtAH2zse6JU16iR8KXz5LZwGZGS4LgIAzOdMbgWL8bZIkx1kZWqYSE0CMRIQh00fpJTnKoe"
                                        >
                                            <button className="btn1">
                                                Extend booking
                                            </button>
                                        </StripeCheckout>
                                    </div>
                                )

                                }
                            </Col>

                            {booking.car[0].name && (
                                <Modal
                                    visible={showModal}
                                    closable={false}
                                    footer={false}
                                    title="Booked time slots"
                                >
                                    <div className="p-2">

                                        {booking.car[0].bookedTimeSlots.map((slot) => {
                                            return (
                                                <button className="btn1 mt-2">
                                                    {slot.from} - {slot.to}
                                                </button>
                                            );
                                        })}

                                        <div className="text-right mt-5">
                                            <button
                                                className="btn1"
                                                onClick={() => {
                                                    setShowModal(false);
                                                }}
                                            >
                                                CLOSE
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            )}

                            <Modal
                                visible={showModalErrorDates}
                                closable={false}
                                footer={false}
                                title="Booked time slots"
                            >
                                <div className="p-2">
                                    Please see booked time slots and pick available dates

                                    <div className="text-right mt-5">
                                        <button
                                            className="btn1"
                                            onClick={() => {
                                                setShowModalErrorDates(false);
                                            }}
                                        >
                                            CLOSE
                                        </button>
                                    </div>
                                </div>
                            </Modal>

                            <Modal
                                visible={showModalExtend}
                                closable={false}
                                footer={false}

                            >
                                <div className="p-2">


                                    <Form
                                        className="bs1 p-2"
                                        layout="vertical"
                                        onFinish={onFinish}
                                    >
                                        <h3>Extend booking</h3>

                                        <hr />
                                        <Form.Item

                                            name="daysAmount"
                                            label="Enter amount of days u want to extend for"
                                            rules={[
                                                { required: true, message: 'Please write amount of days  ' },
                                                {type: 'number', max: 50, message: 'Please write number of days '}
                                            ]}
                                        >
                                            <InputNumber />
                                        </Form.Item>


                                        <div className="text-right">
                                            <button className="btn1">Extend booking</button>
                                        </div>
                                    </Form>


                                    {/*<div className="text-right mt-5">*/}
                                    {/*    <button*/}
                                    {/*        className="btn1"*/}
                                    {/*        onClick={() => {*/}
                                    {/*            setShowModalExtend(false);*/}
                                    {/*        }}*/}
                                    {/*    >*/}
                                    {/*        CLOSE*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}
                                </div>
                            </Modal>

                        </Row>
                }




        </DefaultLayout>
    )
}

export default EditBooking;