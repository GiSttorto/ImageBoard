

//_____________________________SCRIPT.JS________________________________________
// this is where our Vue code will go

(function() {

    new Vue({
        el: '#main',

        data: {
            cities: [
                // {
                //     name: 'Berlin',
                //     country: 'DE'
                // },
                // {
                //     name: 'NY',
                //     country: 'USA'
                // },
                // {
                //     name: 'Tokio',
                //     country: 'Japan'
                // }
            ],
            name: {
                first: 'Pete',
                last: 'anderson'
                // name: 'Giovanna Sttorto"
            },
            food: 'pipoca',
            weekend: 'fun'
        }, //data ends

        mounted: function() {
            var self = this
            //axios is a JS library that's going to allow us to make requests
            //to servers
            //then fucntion runs once we've received response from server
            axios.get("/get-cities").then(function(resp) {
                self.cities = resp.data
                // console.log("response: ", resp.data);
                // console.log("this in then of axios: ", this);
                // console.log("SELF in then of axios: ", self);
            }).catch(function(err) {
                console.log("error: ", err);
            });
            //this function runs when HTML has loaded but the Vue logic hasn't yet
            //we use mounted all the time!
            // it's good for making an ajax request to get data (from API or database etc)
            //so the page can load correctly
            //for example, we're most like get our list of cities from database oe API
            //and mounted would be the best place to make the ajax request
            // console.log("vue instance has mounted!!!");
        }

        // methods: {
        //     //every function that runs in response to an event will be defined in methods
        //     myFn: function(e) {
        //         console.log("myFn's running", e);
        //         e.target.style.color = "tomato"
        //         e.target.style.fontSize = '30px'
        //
        //         this.cities.push({
        //             name: 'Sarajevo',
        //             country: 'BiH'
        //         })
        //
        //         this.cities[0].name = 'Munique'
        //         // console.log(this.cities);
        //         // para acessar coisas dentro de cities
        //     }
        // }
    }) // new Vue ends



})();



//_______________________________INDEX.HTML_____________________________________

<h1>Welcome to my Imageboard</h1>

<div id="main">
    <!-- all of the HTML here is linked or bound to Vue -->
    <!-- <p>{{name.first}}</p> -->

    <!-- city is i -->

     <ul v-for = 'city in cities'>
        <li>{{city.name}}, {{city.country}}</li>
    </ul>

    <p v-if = 'cities.length === 0'>No cities to show :(</p>

    // click events in vue
    <h3 @click = 'myFn'>some words here, clicking is fun</h3>
    <h3 v-on:click = ''></h3>



</div>





//______________________________INDEX.JS(SERVER)________________________________


// this is our server
const express = require("express")
const app = express()
const db = require("./db");

app.use(express.static('./public'))


// let cities = [
//     {
//         name: 'Berlin',
//         country: 'DE'
//     },
//     {
//         name: 'NY',
//         country: 'USA'
//     },
//     {
//         name: 'Tokio',
//         country: 'Japan'
//     }
// ]
// app.get('/get-cities', (req, res) => {
    // res.json is good for sending data from back --> front
    // res.json(cities)
    // console.log("GET /get-cities hit!!!", cities);
    // here we would do a db query to get the list of cities from the db
    // db.getCities().then((results) => {
    //res.json(cities)
    //});
// })



app.listen(8080, () => console.log("I am here!!"))




<script src="/js/vue.js"></script>
<script src="/js/axios.min.js"></script>
<script src="/js/scrip.js"></script>
