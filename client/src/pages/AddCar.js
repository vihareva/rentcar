import {Col, Row, Form, Input} from 'antd'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import Spinner from '../components/Spinner'
import {addCar, getAllCars, getAllCategories} from '../redux/actions/carsActions'
import Radio from "antd/es/radio/radio";


function AddCar() {
    const {categories} = useSelector((state) => state.carsReducer);
    const {loading} = useSelector((state) => state.alertsReducer);
    const [totalCategories, setTotalCategories] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCategories());
    }, []);

    useEffect(() => {
        setTotalCategories(categories);
    }, [categories]);


    function onFinish(values) {
        values.bookedTimeSlots = []
        let carObj = {...values}

        dispatch(addCar(carObj))
        console.log(carObj)
    }

    console.log(categories)

    return (
        <DefaultLayout>
            {loading && (<Spinner/>)}

            <Row justify='center mt-5'>
                <Col lg={12} sm={24} xs={24} className='p-2'>
                    <Form className='bs1 p-2' layout='vertical' onFinish={onFinish}>
                        <h3>Add New Car</h3>
                        <hr/>
                        <Form.Item name='name' label='Car name' rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <div style={{display:'flex', justifyContent:'space-around' }}>
                            <div><Form.Item name='image' label='Image url' rules={[{required: true}]}>
                                <Input/>
                            </Form.Item>
                                <Form.Item name='rentPerHour' label='Rent per hour' rules={[{required: true}]}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item name='capacity' label='Capacity' rules={[{required: true}]}>
                                    <Input/>
                                </Form.Item>
                            </div>
                            <div> <Form.Item name='transmission' label='Transmission' rules={[{required: true}]}>
                                <Input/>
                            </Form.Item>
                                <Form.Item name='fuelType' label='Fuel Type' rules={[{required: true}]}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item name='engineCapacity' label='Engine Capacity' rules={[{required: true}]}>
                                    <Input/>
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item name='country' label='country' rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name='city' label='city' rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name='street' label='street' rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>


                        <Form.Item name='category'>
                            <Radio.Group>
                                {categories.map(c => <Radio value={c.category}>{c.category}</Radio>)}
                            </Radio.Group>
                        </Form.Item>


                        <div className='text-right'>
                            <button className='btn1'>ADD CAR</button>
                        </div>

                    </Form>
                </Col>
            </Row>

        </DefaultLayout>
    )
}

export default AddCar
