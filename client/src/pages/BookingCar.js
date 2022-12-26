import {Col, Row, Divider, DatePicker, Checkbox, Modal, Popover} from "antd";
import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import {getAllCars} from "../redux/actions/carsActions";
import moment from "moment";
import {bookCar} from "../redux/actions/bookingActions";
import StripeCheckout from "react-stripe-checkout";
import {Carousel} from 'antd';
import AOS from 'aos';

import 'aos/dist/aos.css';
import {HeartFilled, HeartOutlined} from "@ant-design/icons";

const {RangePicker} = DatePicker;

function BookingCar({match}) {
    const {cars} = useSelector((state) => state.carsReducer);
    const {loading} = useSelector((state) => state.alertsReducer);
    const {savedCarsIds} = useSelector((state) => state.carsReducer);
    const [car, setcar] = useState({});
    const dispatch = useDispatch();
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [totalHours, setTotalHours] = useState(0);
    const [driver, setdriver] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showModalErrorDates, setShowModalErrorDates] = useState(false);


    useEffect(() => {
        console.log(cars)

        if (cars.length == 0) {
            dispatch(getAllCars());
        } else {
            setcar(cars.find((o) => o._id == match.params.carid));
        }
    }, [cars]);


    useEffect(() => {
        setTotalAmount(totalHours * car.rentPerHour);
        if (driver) {
            setTotalAmount(totalAmount + 30 * totalHours);
        }
    }, [driver, totalHours]);

    let addToSaved = () => {
        // //dispatch({''})
        // //localStorage.setItem('userSaved', JSON.stringify(match.params.carid))
        // let userSavedCars = JSON.parse(localStorage.getItem('userSaved'))
        // if (userSavedCars) {
        //     if(userSavedCars.every(c=>c!==match.params.carid)){
        //         userSavedCars.push(match.params.carid)
        //     }
        //     localStorage.setItem('userSaved', JSON.stringify(userSavedCars))
        // } else {
        //     localStorage.setItem('userSaved', JSON.stringify([match.params.carid]))
        // }
        dispatch({type: 'ADD-SAVED-CAR-ID', payload: match.params.carid})
    }
    const disabledDate = (current) => {
        //документация antd rangepicker и инет
        return current < moment(Date.now()).add('days', -1)
    };

    useEffect(()=>{
        localStorage.setItem('userSaved', JSON.stringify(savedCarsIds))
    }, [savedCarsIds])

    function selectTimeSlots(values) {
        if (values) {
            setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
            console.log(from)
            setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));
            console.log(to)

            for (var booking of car.bookedTimeSlots) {
                if (moment(values[0]).isBetween(booking.from, booking.to) ||
                    moment(values[1]).isBetween(booking.from, booking.to) ||
                    moment(booking.from).isBetween(moment(values[0]), moment(values[1])) ||
                    moment(booking.to).isBetween(moment(values[0]), moment(values[1]))
                ) {
                    setShowModalErrorDates(true);
                    break;
                }
            }

                  setTotalHours(values[1].diff(values[0], "hours"));

        }
    }

    console.log(from)

    console.log(to)

    function onToken(token) {
        const reqObj = {
            token,
            user: JSON.parse(localStorage.getItem("user"))._id,
            car: car._id,
            totalHours,
            totalAmount,
            driverRequired: driver,
            bookedTimeSlots: {
                from,
                to,
            },
        };

        dispatch(bookCar(reqObj));
    }

    console.log(car)

    return (
        <DefaultLayout>
            {loading && <Spinner/>}

            <Row
                justify="center"
                className="d-flex align-items-center"
                style={{minHeight: "90vh"}}
            >
                <Col lg={10} sm={24} xs={24} className='p-3'>

                    {/*<Carousel effect={'fade'}>*/}
                    <div>
                        <img src={car.image} className="carimg2 bs1 w-100"/>
                    </div>
                    {/*<div>*/}
                    {/*    <img src={car.image} className="carimg2 bs1 w-100"/>*/}
                    {/*</div>*/}

                    {/*</Carousel>*/}
                    {car.address && <div>
                        <p><b>Address: </b>{car?.address[0]?.city}, {car?.address[0]?.country}</p>
                        <p>{car?.address[0]?.street}</p>
                    </div>}
                    <button className="btn1 mt-2" onClick={addToSaved}>
                        { savedCarsIds.some(c=>c===match.params.carid)? <HeartFilled/>: <HeartOutlined/> }
                    </button>
                    {/*<img src={car.image} className="carimg2 bs1 w-100" data-aos='flip-left' data-aos-duration='1500'/>*/}
                </Col>

                <Col lg={10} sm={24} xs={24} className="text-right">
                    <Divider type="horizontal" dashed>
                        Car Info
                    </Divider>
                    <div style={{textAlign: "right"}}>
                        <p className={'carnameinhomepages'}>{car.name}</p>
                        <p className={'rentPerHour'}>{car.rentPerHour} $ Per hour /-</p>
                        {car.category && <Popover overlayStyle={{width: "20vw"}}
                                                  placement="bottom"
                                                  title={car.category[0].category}
                                                  content={car.category[0].description}>
                            <p><span className={'headerSpan'}><b>Category :</b></span> <b>{car.category[0].category}</b>
                            </p>
                        </Popover>}

                        <p><span className={'headerSpan'}>Fuel Type :</span> {car.fuelType}</p>
                        <p><span className={'headerSpan'}>Transmission :</span> {car.transmission}</p>
                        <p><span className={'headerSpan'}>Max Persons :</span> {car.capacity}</p>
                        <p><span className={'headerSpan'}>Engine Capacity :</span> {car.engineCapacity}</p>
                    </div>

                    <Divider type="horizontal" dashed>
                        Select Time Slots
                    </Divider>
                    <RangePicker

                        disabledDate={disabledDate}
                        showTime={{format: "HH:mm"}}
                        format="MMM DD yyyy HH:mm"
                        onChange={selectTimeSlots}
                    />
                    <br/>
                    <button
                        className="btn1 mt-2"
                        onClick={() => {
                            setShowModal(true);
                        }}
                    >
                        See Booked Slots
                    </button>
                    {from && to && (
                        <div>
                            <p>
                                Total Hours : <b>{totalHours}</b>
                            </p>
                            <p>
                                Rent Per Hour : <b>{car.rentPerHour} $</b>
                            </p>
                            {/*<Checkbox*/}
                            {/*    onChange={(e) => {*/}
                            {/*        if (e.target.checked) {*/}
                            {/*            setdriver(true);*/}
                            {/*        } else {*/}
                            {/*            setdriver(false);*/}
                            {/*        }*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    Driver Required*/}
                            {/*</Checkbox>*/}

                            <h3>Total Amount : {totalAmount} $</h3>

                            <StripeCheckout
                                shippingAddress
                                token={onToken}
                                currency='USD'
                                amount={totalAmount}
                                stripeKey="pk_test_51KZNyDGfonS0kOfXU7atqutGlXnXtAH2zse6JU16iR8KXz5LZwGZGS4LgIAzOdMbgWL8bZIkx1kZWqYSE0CMRIQh00fpJTnKoe"
                            >
                                <button className="btn1">
                                    Book a car
                                </button>
                            </StripeCheckout>


                        </div>
                    )}
                </Col>

                {car.name && (
                    <Modal
                        visible={showModal}
                        closable={false}
                        footer={false}
                        title="Booked time slots"
                    >
                        <div className="p-2">
                            {car.bookedTimeSlots.map((slot) => {
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

            </Row>

        </DefaultLayout>
    );
}

export default BookingCar;