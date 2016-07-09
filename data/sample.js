/// <reference path=".c4_earth_dev/C4EARTH.d.ts" />

setTimeout(function(){
    earth.setHome(104.739, 24.0153, -242.791, -5.61739, -76.6097, 2.2517e+007);
    earth.lookatHome();
}, 1000 );


setTimeout(function(){
    writeLogMsg("HELLO WORLD!");
}, 2000 );
