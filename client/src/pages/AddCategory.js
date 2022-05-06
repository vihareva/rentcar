import {Col, Row, Form, Input} from 'antd'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import Spinner from '../components/Spinner'
import {addCar, addCategory} from '../redux/actions/carsActions'

function AddCategory() {

    const dispatch = useDispatch()
    const {loading} = useSelector(state => state.alertsReducer)

    function onFinish(values) {
         dispatch(addCategory(values))
        console.log(values)
    }

    return (
        <DefaultLayout>
            {loading && (<Spinner/>)}
            <Row justify='center mt-5'>
                <Col lg={12} sm={24} xs={24} className='p-2'>
                    <Form className='bs1 p-2' layout='vertical' onFinish={onFinish}>
                        <h3>Add New Category</h3>
                        <hr/>
                        <Form.Item name='category' label='Car category' rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>

                        <Form.Item name='description' label='Category description' rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>

                        <div className='text-right'>
                            <button className='btn1'>ADD CATEGORY</button>
                        </div>

                    </Form>
                </Col>
            </Row>

        </DefaultLayout>
    )
}

export default AddCategory
