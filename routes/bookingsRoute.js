const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/booking")
const moment = require("moment")
const { v4: uuidv4 } = require('uuid');


const stripe = require('stripe')('sk_test_51KKQ7lDyMlXjN2deqJciet8HiFs6pEDA0tWy2xpo2uCgqsfCKQBauQcjpvREfdh1RtUPm9S9aMgqdgsqpJyJo3dT00dlDuc0qW')
const Room = require("../models/Room")

router.post("/bookroom", async (req, res) => {
    const { room,
        user,
        fromdate,
        todate,
        totalamount,
        totaldays,
          token } = req.body

        try{
            //console.log('Hello')
            const customer = await stripe.customers.create({
                
                email:token.email,
                source: token.id
            });
           //console.log('Hello')
            const payment = await stripe.charges.create(
                {
                  amount: totalamount * 100,
                  currency: "inr",
                  customer: customer.id,
                  receipt_email: token.email,
                },{
                    idempotencyKey : uuidv4()
                }
            );
            
            if(payment){
              console.log('Hello')
                try{
                    const newbooking = new Booking({
                        room: room.name,
                        roomid: room._id,
                        userid:user._id,
                        fromdate: moment(fromdate).format('DD-MM-YYYY'),
                        todate: moment(todate).format('DD-MM-YYYY'),
                        totalAmount:totalamount,
                        totalDays:totaldays,
                        transactionId: '1234'
                    });
            /*
                   const booking = await newbooking.save()
                     const roomtemp = await Room.findOne({ _id: room._id })
                     roomtemp.currentbookings.push({ bookingid: booking._id, fromdate: moment(fromdate).format('DD-MM-YYYY'), todate: moment(todate).format('DD-MM-YYYY'),
                 userid : userid,
                 status:booking.status
                 });
                     await roomtemp.save()
                     
                */
                     await newbooking.save(async (err, booking) => {
                        const oldroom = await Room.findOne({ _id: room._id });
                  
                        oldroom.currentbookings.push({
                          bookingid: booking._id,
                          fromdate: moment(fromdate).format("DD-MM-YYYY"),
                          todate: moment(todate).format("DD-MM-YYYY"),
                          userid: user._id,
                          status:booking.status
                        });
                        await oldroom.save();
                      });
            
                   res.send('Room Booked Successfully');
                 
            
            }  catch (error) {
                console.log(error);
                return res.status(400).json({ message: error });
              }
            } else {
              res.send("Payment failed");
            }
          } catch (error) {
            return res.status(400).json({ message: " " + error });
          }
      
});

router.post("/getbookingbyuserid",async(req,res)=>{
  const userid = req.body.userid
  try{
    const bookings = await Booking.find({userid : userid});
    res.send(bookings)
  }catch(error){
    return res.status(400).json({error});
  }
}); 

router.post("/cancelbooking",async(req,res)=>{
  //const {bookingid,roomid} = req.body
 /* const bookingid = req.body.bookingid
  const roomid = req.body.roomid

  try{
    const bookingitem = await Booking.findOne({_id:bookingid})
    bookingitem.status = 'cancelled'
    await bookingitem.save()
    const room = await Room.findOne({_id:roomid})
    const bookings = room.currentbookings
    const temp  = bookings.filter(booking=>booking.bookingid.toString()!==bookingid)
    room.currentbookings = temp
    await room.save()
    res.send('Your booking cancelled successfully')
  }catch(error){
     return res.status(400).json({error});
  }*/
  const {bookingid,roomid } = req.body;
  

  try {

    const bookingitem = await Booking.findOne({_id: bookingid}) 
    bookingitem.status='cancelled'
    await bookingitem.save();
    const room = await Room.findOne({_id:roomid})
    const bookings = room.currentbookings
    const temp=bookings.filter(booking=>booking.bookingid.toString()!==bookingid)
    console.log(temp);
    room.currentbookings=temp;
    await room.save()

    res.send('Booking deleted successfully')
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router