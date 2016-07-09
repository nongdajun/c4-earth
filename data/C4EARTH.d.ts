//--------------------------------------------
//CLASSES DEFINITION
//--------------------------------------------

declare class qobject {}
declare class viewpoint{x:number; y:number; z:number; h:number; p:number; r:number}
declare class vec3d{x:number; y:number; z:number}

//TIMER
declare class timer{
    start():void;
    start(timeout:number):void;
    dispose(force?:boolean):void;
}

//TIMELINE
declare class timeline{
    reset():void;
    play(startTime?:number, multiple?:number):void;
    push(handler:any, duration:number):void;
    getTotalSeconds():number;
    getActionCount():number;
    isEmpty():boolean;
    isStarted():boolean;
}

//MARKER
declare class marker{
    setText(text:string):void;
	getText():string;

	getClassId():string;

	valid():boolean;
	
	show():void;
	
	hide():void;
	
	setVisible(visible:boolean):void;
	getVisible():boolean;
	
	setPosition(x:number, y:number):void;
	setPosition(x:number, y:number, z:number):void;
	setPosition(vec3:{x:number;y:number;z?:number}):void;
	getPosition():{x:number;y:number;z?:number};

	setState(state:string):void;
	getState():string;
	
	initTracks():void;
	removeTracks():void;
	getMoveTrack():track;
	getPlanTrack():track;
}

//TRACK
declare class track{
    push(x:number, y:number):void;
	push(x:number, y:number, z:number):void;
	push(vec3:{x:number;y:number;z?:number}):void;

	pop();

	insert(index:number, x:number, y:number):void;
	insert(index:number, x:number, y:number, z:number):void;
	insert(index:number, vec3:{x:number;y:number;z?:number}):void;

	remove(index:number):void;

	setData(data:Array<{x:number;y:number;z?:number}>, append:boolean):void;
	getData():Array<{x:number;y:number;z?:number}>;

	setColor(color:string):void;
	getColor():string;
	
	setVisible(visible:boolean);
    getVisible():boolean;

	show():boolean;

	hide():boolean;

	clear():boolean;

	update(force?:boolean):void;
}


//--------------------------------------------
//EARTH NAMESPACES
//--------------------------------------------

declare namespace earth{

    function alert(message?:any):void;
    function confirm(message?:any):boolean;

    function setTimeout(handler:any, timeout:number):timer;	 
    function clearTimeout(handle:timer);	 
    function setInterval(handler:any, timeout:number):timer;	 
    function clearInterval(handle:timer);	
    function setTimeline():timeline;	 
    function clearTimeline(handle:timeline);	

    function createObject(classname:string):qobject;

    function abort(result?:any):void;
    function reset(result?:any):void;

    function sleep(msec:number):void;

    function require(module:string):qobject;

    var version:string;
    var displayScriptErrors:boolean;

    //EVENT
    namespace event{

    }

    //MATH
    namespace math{
        function distance(x1:number, y1:number, x2:number, y2:number):number;
	    function distance(srs:string, x1:number, y1:number, x2:number, y2:number):number;
    }

    //SENSE
    namespace sense{
        function createMarker(typeid:string, text:string, x:number, y:number, z:number): marker;
        function removeMarker(handle:marker):boolean;
        function existsMarker(handle:marker):boolean;
        function createTrack(color:string, clamp:boolean, solid:boolean):track;
        function removeTrack(handle:track):boolean;
        function existsTrack(handle:track):boolean;            
        function getAllMarkers(typeid?:string):Array<marker>;
        function clearMarkers():void;
        function getAllTracks():Array<track>;
        function clearTracks():void;

        var lighting:boolean;
        function setEnableLighting(enable:boolean):void;
        function getEnableLighting():boolean;
        var decluttering:boolean;
        function setEnableDecluttering(enable:boolean):void;
        function getEnableDecluttering():boolean;
        var view3dMode:boolean;
	    function setEnable3dViewMode(enable:boolean):void;
	    function getEnable3dViewMode():boolean;

        var battleTime:number;
        function setBattleTime(sec:number):void;
        function getBattleTime():number;
        var battleTimeStarted:boolean;
        function setEnableBattleTime(started:boolean):void;
        function getEnableBattleTime():boolean;

        function playSound(filename:string):void;
        function writeLogMessage(message:string):void;
        function clearLogMessage():void;
    }

    //UI
    namespace ui{
        var operLock:boolean;
        function setEnableOperationLock(value:boolean):void;
        function getEnableOperationLock():boolean;
	
		var fullscreen:boolean;
        function setEnableFullscreen(value:boolean):void;
        function getEnableFullscreen():boolean;
	
        var messageVisible:boolean;
        function setMessageVisible(value:boolean):void;
        function getMessageVisible():boolean;
        
        var timeVisible:boolean;
        function setTimeVisible(value:boolean):void;
        function getTimeVisible():boolean;
    }

    //VIEW
    namespace view{

        function setHomeViewpoint(vp:viewpoint):void;	
	    function setHomeViewpoint(x:number, y:number, z:number):void;
	    function setHomeViewpoint(x:number, y:number, z:number, h:number, p:number, r:number):void;	
	    function getHomeViewpoint():viewpoint;	
	    function goHomeViewpoint(duration?:number):void;

        function setViewpoint(vp:viewpoint, duration?:number):void;
        function setViewpoint(x:number, y:number, z:number, duration?:number):void;	
        function setViewpoint(x:number, y:number, z:number, h:number, p:number, r:number, duration?:number):void;	
        function setViewpoint(handle:marker, duration?:number):void;
		function getViewpoint():viewpoint;

        function tetherMarker(handle:marker, duration?:number):void;

        function zoom(dx:number, dy:number):void;
        function rotate(dx:number, dy:number):void;
        function pan(dx:number, dy:number):void;
    }

}



