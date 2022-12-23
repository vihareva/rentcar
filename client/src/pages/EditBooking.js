import React, {useEffect, useState} from "react";
import {editCar, getAllCars} from "../redux/actions/carsActions";
import {useDispatch, useSelector} from "react-redux";
import DefaultLayout from "../components/DefaultLayout";

import {Col, Row, Divider, Popover, Modal, Form, Input} from "antd";
import Spinner from "../components/Spinner";
import StripeCheckout from "react-stripe-checkout";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";

function EditBooking({match}) {
    const dispatch = useDispatch();
    const {cars} = useSelector((state) => state.carsReducer);
    const [car, setcar] = useState({});
    const {loading} = useSelector((state) => state.alertsReducer);
    const [showModal, setShowModal] = useState(false);
    const [showModalErrorDates, setShowModalErrorDates] = useState(false);
    const [showModalExtend, setShowModalExtend] = useState(false);
    const {savedCarsIds} = useSelector((state) => state.carsReducer);

    useEffect(() => {
        console.log(car)

        if (cars.length == 0) {
            dispatch(getAllCars());
        } else {
            setcar(cars.find((o) => o._id == match.params.carid));
        }
    }, [cars]);
    console.log(car)

    function onFinish(values) {
        // values._id = car._id;
        //
        // dispatch(editCar(values));
        let daysamount=Number(values.daysAmount)
        console.log(daysamount);
    }

    let addToSaved = () => {
        dispatch({type: 'ADD-SAVED-CAR-ID', payload: match.params.carid})
    }
    return(

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
                    <button
                        className="btn1 mt-2"
                        onClick={() => {
                            setShowModalExtend(true);
                        }}
                    >
                        Extend My Booking
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

                <Modal
                    visible={showModalExtend}
                    closable={false}
                    footer={false}

                >
                    <div className="p-2">


                                    <Form
                                        initialValues={car}
                                        className="bs1 p-2"
                                        layout="vertical"
                                        onFinish={onFinish}
                                    >
                                        <h3>Extend booking</h3>

                                        <hr />
                                        <Form.Item
                                            name="daysAmount"
                                            label="Enter amount of days u want to extend for"
                                            rules={[{ required: true }]}
                                        >
                                            <Input />
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

        </DefaultLayout>
    )
}

export default EditBooking;