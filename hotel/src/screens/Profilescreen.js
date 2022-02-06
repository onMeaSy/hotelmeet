import React,{useEffect,useState} from 'react';
import Loader from "../components/Loader";
import Error from "../components/Error";
import { Tabs,Tag } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2'

const { TabPane } = Tabs;



function Profilescreen() {

 const user = JSON.parse(sessionStorage.getItem("currentUser"))

 useEffect(()=>{
     if( !user){
         window.location.href = '/login'
     }
 },[])

return <div className='ml-3 mt-3'>

        <Tabs defaultActiveKey="1" >
            <TabPane tab="Profile" key="1">
               <br/>
               <h1>Name:{user.name}</h1>
               <h1>Email : {user.email}</h1>
               <h1>isAdmin : {user.isAdmin ? 'YES':'NO'}</h1>
            </TabPane>
            <TabPane tab="Bookings" key="2">
                <MyBookings/>
            </TabPane>
           
        </Tabs>

    </div>;
}

export default Profilescreen;

export function MyBookings(){

    const user = JSON.parse(sessionStorage.getItem('currentUser'))
    const [bookings,setbookings] = useState([])
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    //console.log(user.email)
    useEffect(async()=>{

       try{
           setloading(true)
        const data = await (await axios.post('/api/bookings/getbookingbyuserid',{userid : user._id})).data
        console.log(data)
        setbookings(data)
        setloading(false)
       
       }catch(error){
           console.log(error)
           setloading(false)
           seterror(error)

       }
    },[]);  

async function cancelBooking(bookingid,rooomid){
    try{setloading(true)
        const result = await (await axios.post("/api/bookings/cancelbooking",{bookingid,rooomid})).data
        console.log(result)
        setloading(false)
         Swal.fire('Congratulations', 'Room deleted', 'success').then(result => {
           window.location.reload()
        })
    }catch(error){
        console.log(error)
        setloading(false) 
        //Swal.fire('Oops', 'Something went wrong', 'error')
        Swal.fire('Congratulations', 'Room booked', 'success').then(result => {
            window.location.href = '/profile'
        })
    }
}

    return(
        <div>
           <div className='row'>
               <div className='col-md-6'>

                   {loading && (<Loader/>)}
                   {bookings && (bookings.map(booking=>{
                       return <div className='bs'>
                           <h1 className='tem'>{booking.room}</h1>
                           <br/>
                           <p>BookingId : {booking._id}</p>
                           <p>CheckIn : {booking.fromdate}</p>
                           <p>Check Out : {booking.todate}</p>
                           <p>Amount : {booking.totalamount}</p>
                           <p>Status : {booking.status =='booked' ? (<Tag color="green">Confirmed</Tag>) : (<Tag color="red">Cancelled</Tag>)}</p>

                           {booking.status !== 'cancelled' ? (
                           <div className='text-right'>

                               <button class = 'btn btn-primary' onClick={()=>{cancelBooking(booking._id,booking.roomid)}}>CANCEL BOOKING</button>

                           </div>
                           ): <div className='text-right'>

                          

                       </div>}
                           </div>
                   }))}
 
               </div>
           </div>
        </div> 
    )
}
