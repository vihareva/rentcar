import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import {findCarsInCategory, getAllCars, getAllCategories} from '../redux/actions/carsActions'
import {Col, Row, Divider, DatePicker, Form, Input, Slider, Select} from 'antd'
import Spinner from '../components/Spinner';
import moment from 'moment'
import {Option} from "antd/es/mentions";

const {RangePicker} = DatePicker

function Home() {
    const {categories} = useSelector((state) => state.carsReducer);
    const {cars} = useSelector(state => state.carsReducer)
    const {filteredCars} = useSelector(state => state.carsReducer)
    const {filteredCarsInCategory} = useSelector(state => state.carsReducer)
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
    }, [])


    useEffect(() => {
        dispatch(getAllCategories());
    }, []);

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

        setTotalcars(filteredCarsInCategory)

    }, [filteredCarsInCategory])

    let currentUser = JSON.parse(localStorage.getItem("user"))._id

    if (categories) {
        var categoriesOptions = categories.map(c => {
            return {label: c.category.toUpperCase(), value: c.category}
        })
    }

    // function onChangeCategory(e){
    //     dispatch(findCarsInCategory(e.target.value))
    // }


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
        // dispatch(getFilteredCars(values))
    }

    function findByCategory(values) {
        console.log(values)
         dispatch(findCarsInCategory(values))
    }


    return (
        <DefaultLayout>
            <Row gutter={16} justify='center'>
                <Col lg={20} sm={24} xs={24}>
                    <Row className="mt-3 " justify='space-between'>

                        <Col lg={12} sm={24}>

                            <Form initialValues={{rentPerHour: [0, 20]}} layout='vertical' onFinish={setMyFilter}>

                                <Form.Item name='rentPerHour' label='rent Per Hour'
                                           rules={[
                                               {
                                                   required: true,
                                                   message: 'Please input name of car',
                                               },
                                           ]}
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
                                    <Form  onFinish={findByCategory}>
                                        <Form.Item name='categories' label='Category'
                                                   rules={[
                                                       {
                                                           required: true,
                                                           message: 'Please input name of car',
                                                       },
                                                   ]}
                                        >
                                            <Select
                                                mode="multiple"
                                                style={{width: '100%'}}
                                                allowClear
                                                placeholder="Please select"
                                            >
                                                {categories.map(c => <Option key={c.category}>{c.category}</Option>)}
                                            </Select>
                                        </Form.Item>
                                        <button className='btn1 mt-2'>Find By Category</button>
                                    </Form>
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
