import React, {useState, useEffect,useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import {deleteCar, getAllCars, getAllCategories} from "../redux/actions/carsActions";
import {Col, Row, Divider, DatePicker, Checkbox, Edit} from "antd";
import {Link} from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Popconfirm, message} from "antd";
import axios from "axios";

const {RangePicker} = DatePicker;

function AdminHome() {
    const {cars} = useSelector((state) => state.carsReducer);
    const {loading} = useSelector((state) => state.alertsReducer);
    const [totalCars, setTotalcars] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCars());
        dispatch(getAllCategories());
    }, []);

    useEffect(() => {
        setTotalcars(cars);
    }, [cars]);

    let currentUser = JSON.parse(localStorage.getItem("user"))._id
    const fileInput = useRef()


    const selectJson = (e) => {
        if (e.target.files) {
            const fileReader = new FileReader();
            var file=e.target.files[0]
            // console.log(file)
            // var data = JSON.parse(file);
            // console.log(data)

            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = e => {
                const content = e.target.result;
                console.log(content);
                var postData=JSON.parse(content)
                console.log(postData);

                axios.post(
                    '/api/cars/import',
                    postData
                )
                    .then(res => {
                        console.log(`Success`)
                    })
                    .catch(error => {

                            message.error(`${error.response.data._message} please download correct json`)

                    })
            };
        }


        // axios.post(
        //     '/api/cars/import',
        //     formData,
        //     {
        //         headers: {
        //             "Content-type": "multipart/form-data"
        //         },
        //     }
        // )
        //     .then(res => {
        //         console.log(`Success` + res.data);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }

    // const OnSumbit = (event) => {
    //     event.preventDefault();
    //     const formData = new FormData(event.target.form);
    //
    //     axios
    //         .post("/api/cars/import", formData, {
    //             headers: {
    //                 "Content-type": "multipart/form-data",
    //             },
    //         })
    //         .then((res) => {
    //             console.log(`Success` + res.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };


    return (
        <DefaultLayout>
            <Row justify="center" gutter={16} className="mt-2">
                <Col lg={20} sm={24}>
                    <div className="d-flex justify-content-between align-items-center">
                        <button className="btn1">
                            <a href="/addcar">ADD CAR</a>
                        </button>
                        <button className="btn1">
                            <a href="/addcategory">ADD CATEGORY</a>
                        </button>
                        <input style={{display: 'none'}} ref={fileInput} type="file"
                               onChange={selectJson}/>
                        <button onClick={() => fileInput.current.click()}>
                           download
                        </button>
                        {/*<form onSubmit={OnSumbit}>*/}

                        {/*    <input*/}

                        {/*        id="contained-button-content"*/}
                        {/*        name="customFile"*/}
                        {/*        type="file"*/}
                        {/*    />*/}
                        {/*    <button>zakr</button>*/}
                        {/*    /!*<Button variant="contained" color="primary">*!/*/}
                        {/*    /!*    Сохранить и закрыть*!/*/}
                        {/*    /!*</Button>*!/*/}
                        {/*</form>*/}
                    </div>
                </Col>
            </Row>

            {loading == true && <Spinner/>}

            <Row justify="center" gutter={16}>
                {totalCars.map((car) => {
                    return (
                        <Col lg={5} sm={24} xs={24}>
                            <div className="car p-2 bs1">
                                <img src={car.image} className="carimg"/>

                                <div className="car-content d-flex align-items-center justify-content-between">
                                    <div className="text-left pl-2">
                                        <p className={'carnameinhomepages'}>{car.name}</p>
                                        <p className={'rentPerHour'}> {car.rentPerHour} $/Hour</p>
                                    </div>

                                    <div className="mr-4">
                                        <Link to={`/editcar/${car._id}`}>
                                            <EditOutlined
                                                className="mr-3"
                                                style={{color: "green", cursor: "pointer"}}
                                            />
                                        </Link>

                                        <Popconfirm
                                            title="Are you sure to delete this car?"
                                            onConfirm={() => {
                                                dispatch(deleteCar({carid: car._id}))
                                            }}

                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <DeleteOutlined
                                                style={{color: "red", cursor: "pointer"}}
                                            />
                                        </Popconfirm>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </DefaultLayout>
    );
}

export default AdminHome;
