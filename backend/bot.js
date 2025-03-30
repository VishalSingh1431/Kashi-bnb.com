// let cou=100

// while(cou){
//     try{
//         const res = await fetch("https://kashi-bnb-production.up.railway.app/");
//         const stream = res.body.pipeThrough(new TextDecoderStream());
//         for await (const val of stream){
//             console.log(val);
//         }
//     }
//     catch(e){
//         console.log(e);
//         break;
//     }
//     cou--;
// }

import { prisma } from './utils/client.js'
import bcrypt from 'bcrypt';


const me = await prisma.users.findUnique({
    where: {
        email : "subrat.singh.cer21@itbhu.ac.in"
    }
})

// const hotel = await prisma.hotels.create({
//     data:{
//         name : "viswakarma",
//         address : "IIT BHU, Hyderabad Colony, Varanasi",
//         ownerId : me.id,
//         gmap : "https://maps.app.goo.gl/GJ2Cm9jXutJDXwoc9",
//     }
// })

// const img = await prisma.himages.create({
//     data : {
//         url : "https://iitbhu.ac.in/sites/default/files/institute/others/hostels/img/slider/vishwakarma/slider_02.jpg",
//         name : "hostel profile",
//         hotelId : hotel.id,
//     }
// });

// let hotel = await prisma.hotels.update({
//     where : {
//         id : "35bf912c-956e-48bb-90a6-7ad745bc6282",
//     },
//     data : {
//             rate : 100,
//             s1 : 'wifi',
//             s2 : 'wifi',
//             s3 : 'wifi',
//             s4 : 'wifi',
//     }
// });
// let newp = await bcrypt.hash(me.password,10);
let hotel = await prisma.users.update({
    where : {
        email : me.email,
    },
    data : {
        has_hotel : true,
    }
    // select : "owner"
});

// // console.log(me);
console.log(hotel);
// // console.log(img);


// let da = new Date();


// da.setDate(9);
// da.setMonth(2);
// da.setFullYear(2002);

// // da.setHours(0,0,0,0);
// console.log(da);
