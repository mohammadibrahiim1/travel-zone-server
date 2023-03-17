// const data = require('./genarator.json')
const fs = require('fs')
/**
 * 
 * @param {Number} limit
 * @param {*} data 
 */
const Genarator=(limit=1)=>{
  const generated = []
  const Schema = {
    // flight_name
    f1:["A380 Airbus","A300 Airbus","B787 Airbus", "C-130 Airbus" ],
    // destination
    f2 : ['Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437'],
    // location
    f3 : ['Dhaka - Karachi','Lahore - Karachi','Lahore - Dubai','Dhaka - Dubai' , 'Lahore - Dhaka', 'Dhaka - Japan'],
    // airlines_logo_URL
    f4 :['./img/Qatar.jpg','./img/emirates.png','./img/FlyDubai-Logo.png','./img/qantas.png' , './img/japanairline.png'],
    // airlines_name
    f5 : ["Qatar Airways", "Emirates" ,"Flydubai","Qantas","Japan Airline"],
    // Hero_URL
    f6:['https://drive.google.com/file/d/1viS7s3_8si9hohIr1KJPqTwWL0l4jwa0/view?usp=share_link'],
    // economy_URL
    f7:[
      "https://drive.google.com/file/d/1T_8Pq9ozpOzKIcT0ifh2ohKJqH-BD-bk/view?usp=share_link",
      "https://drive.google.com/file/d/1McR0-t0Plo_QrURzk_9CqU4s2RuLK15x/view?usp=share_link",
      "https://drive.google.com/file/d/16e__fsk3g8dwzGj_5l9pl7uhQ2dmAm2M/view?usp=share_link",
      "https://drive.google.com/file/d/198TCh7MdMXFBs2zG14YD_pJyFO3wBoC7/view?usp=share_link",
      "https://drive.google.com/file/d/1f2qtuBZ7yA0rHuXoLWYPco_r6NY90Md_/view?usp=share_link",
      "https://drive.google.com/file/d/192slrSKT2krw-raOAtw4H6km2fCGbg9s/view?usp=share_link"
    ] ,
    // ratings
    f8:[4.5,4.9,3.5,4.3,4.7],
    // price
    f9:[340,450,560,70,200,140,390,400,265,57],
    // time
    f10:[
      { "departure":"10:30 am" , "arrival": "12:45 am" },
      { "departure":"10:00 am" , "arrival": "1:00 pm" },
      { "departure":"10:50 am" , "arrival": "11:30 am" },
      { "departure":"9:40 am" , "arrival": "11:45 am" },
      { "departure":"10:30 am" , "arrival": "11:00 am" },
    ],
    // return_time
    f11:[
      { "departure":"10:30 am" , "arrival": "12:45 am" },
      { "departure":"10:00 am" , "arrival": "1:00 pm" },
      { "departure":"10:50 am" , "arrival": "11:30 am" },
      { "departure":"9:40 am" , "arrival": "11:45 am" },
      { "departure":"10:30 am" , "arrival": "11:00 am" },
    ],
    // return
    f12 : [true , false],
    // flight_capacity 
    f13 : [
      { "economy":400,"first":60,"busines":80},
      { "economy":510,"first":70,"busines":20},
      { "economy":600,"first":60,"busines":12},
      { "economy":560,"first":20,"busines":30},
      { "economy":330,"first":40,"busines":80},
      { "economy":410,"first":20,"busines":30}
  ]
  }
  for(let i=0;i<limit ; i++){
    flight = Math.floor(Math.random() * Schema.f5.length)
     data = {
        flight_name: `${Schema.f5[flight]} A380 Airbus`,
        destination: Schema.f2[Math.floor(Math.random() * Schema.f2.length)] ,
        location: Schema.f3[Math.floor(Math.random() * Schema.f3.length)],
        airlines_logo_URL : Schema.f4[flight] , 
        airlines_name:Schema.f5[flight],
        Hero_URL : Schema.f6[Math.floor(Math.random() * Schema.f6.length)] , 
        economy_URL : Schema.f7,
        first_URL : [] ,
        busines_URL : [],
        ratings :Schema.f8[Math.floor(Math.random() * Schema.f8.length)],
        price :Schema.f9[Math.floor(Math.random() * Schema.f9.length)], 
        time :Schema.f10[Math.floor(Math.random() * Schema.f10.length)], 
        return_time :Schema.f11[Math.floor(Math.random() * Schema.f11.length)],
        return : Schema.f12[Math.floor(Math.random() * Schema.f12.length)],
        airlines_Policies :"",
        flight_capacity : Schema.f13[Math.floor(Math.random() * Schema.f13.length)] ,
        reviews:[]
     }

     


     generated.push(data)
  }

  return generated
}

const result = JSON.stringify( Genarator(300))

console.log( result )


fs.writeFile('./genarator.json', result, (err)=>{
  try {
    console.log( " done")
    
  } catch (err) {
    console.log( err)
    
  }
})
console.log()
// console.log( JSON.parse(result) )