import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import moment from "moment"
import Error from "../components/Error";
import StripeCheckout from "react-stripe-checkout";
import { Button } from "bootstrap";
import Swal from 'sweetalert2'


function Bookingscreen({ match }) {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();
    const [room, setroom] = useState();

    const roomid = match.params.roomid
    const fromdate = moment(match.params.fromdate, 'DD-MM-YYYY')
    const todate = moment(match.params.todate, 'DD-MM-YYYY')

    const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1

    const [totalamount, settotalamount] = useState()
    useEffect(async () => {

            if(!sessionStorage.getItem('currentUser')){
                window.location.reload='/login'
            }

        try {
            setloading(true);
            const data = await (await axios.post("/api/rooms/getroombyid" , {roomid})).data;
            console.log(data)
            settotalamount(data.rentperday * totaldays)
            setroom(data);
            setloading(false);
        } catch (error) {

            setloading(false);
            //seterror(true);

        }
    }, []);

   
    async function onToken(token) {
        console.log(token)
        const bookingDetails = {
            room,
            user: JSON.parse(sessionStorage.getItem('currentUser')),
            fromdate,
            todate,
            totalamount,
            totaldays,
            token
        }

        try {
            setloading(true)
            console.log('hello')
            const result = await axios.post('/api/bookings/bookroom', bookingDetails)
            console.log('hello')
            console.log(result.name)
            setloading(false)
            Swal.fire('Congratulations', 'Room booked', 'success').then(result => {
                window.location.href = '/profile'
            })
        } catch (error) {
            setloading(false)
            console.log(error)
            Swal.fire('Oops', 'Something went wrong', 'error')
            
        }
    }

    return (
        <div className="m-5 px-2">
            {loading ? (<Loader />) : room ?
                (

                    <div className="row p-3 mb-5 bs">

                        <div className="col-md-6 my-auto">

                            <div>
                                <h1> {room.name}</h1>
                                <img src={room.imageurls[0]} style={{ height: '400px' }} />
                            </div>

                        </div>

                        <div className="col-md-6 text-right">
                            <div>
                                <h1><b>Booking Details</b></h1>
                                <hr />

                                <p><b>Name :  {JSON.parse(sessionStorage.getItem('currentUser')).name}</b> </p>

                                <p><b>From Date : {match.params.fromdate}</b> </p>
                                <p><b>To Date : {match.params.todate} </b> </p>
                                <p><b>Max Count : {room.maxcount}</b></p>
                            </div>

                            <div className='mt-6'>
                                <h1><b>Amount</b></h1>
                                <hr />
                                <p>Total Days : {totaldays}<b></b></p>
                                <p>Rent Per Day : <b>{room.rentperday}</b></p>
                                <h1><b>Total Amount :{totalamount} </b></h1>


                                <div style={{ float: "right" }}>



                                    <StripeCheckout
                                        amount={totalamount * 100}
                                        token={onToken}
                                        currency='INR'
                                        stripeKey='pk_test_51KKQ7lDyMlXjN2deVRjV9hWVcOjLv0ynMK9Hhq7KQx1Cxb4awON5gOaOvfOUq1SXT0XUa6tWchxafmLoZHyG6c4J00ZqhzTBqG'>
                                        <button className='btn btn-primary'>Pay Now</button>
                                    </StripeCheckout>


                                </div>




                            </div>



                        </div>

                    </div>

                ) : (<Error />)}

        </div>
    )


}

export default Bookingscreen

