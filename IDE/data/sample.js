/// <reference path=".earth_dev/C4EARTH.d.ts" />

var timer1 = earth.setTimeout(function(){
    earth.view.setViewpoint(104.739, 24.0153, -242.791, -5.61739, -76.6097, 2.2517e+007);
    earth.view.goHomeViewpoint();
}, 1000 );


earth.sense.writeLogMessage("HELLO WORLD!");


