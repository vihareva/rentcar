import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import {
    findCarsInAddress,
    findCarsInCategory,
    getAllCars,
    getAllCategories,
    getAllLocations,
    getFilteredCars
} from '../redux/actions/carsActions'
import {Col, Row, Divider, DatePicker, Form, Input, Slider, Select, Tooltip, Card, Space} from 'antd'
import Spinner from '../components/Spinner';
import moment from 'moment'
import {Option} from "antd/es/mentions";
import { Radio } from 'antd';

const {RangePicker} = DatePicker

function Home() {
    const {categories} = useSelector((state) => state.carsReducer);
    const {locations} = useSelector((state) => state.carsReducer);
    const {cars} = useSelector(state => state.carsReducer)
    const {filteredCars} = useSelector(state => state.carsReducer)
    const {filteredCarsInAddress} = useSelector(state => state.carsReducer)
    const {loading} = useSelector(state => state.alertsReducer)
    const [totalCars, setTotalcars] = useState([])
    const [maxRentPerHour, setMaxRentPerHour] = useState(0)
    const dispatch = useDispatch()

    function findMaxRent() {
        let max = cars[0].rentPerHour;
        for (let i = 1; i < cars.length; ++i) {
            if (cars[i].rentPerHour > max) max = cars[i].rentPerHour;
        }
        setMaxRentPerHour(max)
        console.log(maxRentPerHour)
    }

    useEffect(() => {
        dispatch(getAllCars())
        dispatch(getAllCategories());
        dispatch(getAllLocations());
        if(JSON.parse(localStorage.getItem('address'))){
            localStorage.removeItem('address')
        }
    }, [])

    //
    // useEffect(() => {
    //     dispatch(getAllCategories());
    // }, []);
    // useEffect(() => {
    //     dispatch(getAllLocations());
    // }, []);

    useEffect(() => {

        setTotalcars(cars)
        if (cars.length !== 0) {
            findMaxRent()
        }

    }, [cars])
    useEffect(() => {

        setTotalcars(filteredCars)

    }, [filteredCars])

    useEffect(() => {

        setTotalcars(filteredCarsInAddress)

    }, [filteredCarsInAddress])


    function setFilter(values) {

        var selectedFrom = moment(values[0], 'MMM DD yyyy HH:mm')
        var selectedTo = moment(values[1], 'MMM DD yyyy HH:mm')

        var temp = []

        for (var car of cars) {

            if (car.bookedTimeSlots.length == 0) {
                temp.push(car)
            } else {

                for (var booking of car.bookedTimeSlots) {

                    if (selectedFrom.isBetween(booking.from, booking.to) ||
                        selectedTo.isBetween(booking.from, booking.to) ||
                        moment(booking.from).isBetween(selectedFrom, selectedTo) ||
                        moment(booking.to).isBetween(selectedFrom, selectedTo)
                    ) {

                    } else {
                        temp.push(car)
                    }

                }

            }

        }

        setTotalcars(temp)

    }

    function setMyFilter(values) {
        console.log(values)
        const filterWithAddress={...values, address: JSON.parse(localStorage.getItem('address'))}
        console.log(filterWithAddress)
        dispatch(getFilteredCars(filterWithAddress))
    }

    function findByAddress(values) {
        console.log(values)
        localStorage.setItem('address', JSON.stringify(values))
         dispatch(findCarsInAddress(values))
    }


    return (
        <DefaultLayout>
            <Row gutter={16} justify='center'>
                <Col lg={20} sm={24} xs={24}>
                    <Row className="mt-3 " justify='space-between'>

                        <Col lg={12} sm={24}>

                            <Form  layout='vertical' onFinish={setMyFilter}>

                                <Form.Item name='rentPerHour' label='rent Per Hour'
                                           // rules={[
                                           //     {
                                           //         required: true,
                                           //         message: 'Please enter a  rent Per Hour range ',
                                           //     },
                                           // ]}
                                >
                                    <Slider range min={0} max={maxRentPerHour}/>
                                </Form.Item>

                                <Form.Item name='name' label='Name of Car'
                                           rules={[
                                               {
                                                   // required: true,
                                                   message: 'Please input name of car',
                                               },
                                           ]}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item name='categories' label='Category'
                                >
                                    <Select
                                        mode="multiple"
                                        style={{width: '100%'}}
                                        allowClear
                                        placeholder="Please select"
                                    >
                                        {categories.map(c => <Option  title={c.description}  key={c.category}>{c.category}</Option>)}
                                    </Select>
                                </Form.Item>

                                <button className='btn1 mt-2'>Filter</button>
                            </Form>


                        </Col>

                        <Col lg={12} sm={24}>
                            <Row gutter={[24, 48]} justify='end'>
                                <Col>
                                    <RangePicker showTime={{format: 'HH:mm'}} format='MMM DD yyyy HH:mm'
                                                 onChange={setFilter}/>
                                </Col>
                                <Col>
                                        <Card title="Choose address you want to pick up car from" style={{ width: 400 }}>
                                            <Form onFinish={findByAddress}>
                                                <Form.Item name='addressID' label='Location'
                                                >
                                                    <Radio.Group >
                                                        <Space direction="vertical">
                                                        {locations.map(l =><Radio value={l._id}>{`${l.country} , ${l.city} : ${l.street}`}</Radio>)}
                                                        </Space>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <button className='btn1 mt-2'>Filter</button>
                                            </Form>
                                        </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

            </Row>


            {loading == true && (<Spinner/>)}

            <Row justify='center' gutter={64}>

                {totalCars.map(car => {
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
                {totalCars.length === 0 && <h1>No cars found</h1>}

            </Row>

        </DefaultLayout>
    )
}

export default Home
