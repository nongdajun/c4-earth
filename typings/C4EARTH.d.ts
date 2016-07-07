//--------------------------------------------
//GLOBAL FUNCTIONS
//--------------------------------------------
declare class qobject {}
declare class viewpoint{x:number; y:number; z:number; h?:number; p?:number; r?:number}
declare class vec3d{x:number; y:number; z?:number}


declare function alert(message?:any):void;
declare function confirm(message?:any):void;

declare function setTimeout(handler:any, timeout:number):qobject;	 
declare function clearTimeout(handle:qobject);	 
declare function setInterval(handler:any, timeout:number):qobject;	 
declare function clearInterval(handle:qobject);	

declare function createObject(classname:string):qobject;

declare function end():void;

declare function sleep(ms:number):void;

declare function playSound(soundfile:string):boolean;

declare function writeLogMsg(message:string):void;
declare function clearLogMsg():void;

//--------------------------------------------
//ANIMATE
//--------------------------------------------
declare var animate:{
    reset():void;
	create(name:string):void;
	remove(name:string):void;
	play(name:string, startTime?:number):void;
	add(name:string, handler:any, duration:number):void;
	exists(name:string):boolean;
}

//--------------------------------------------
//EARTH
//--------------------------------------------
declare var earth:{
    getHome():{x:number; y:number; z:number; h?:number; p?:number; r?:number};
	getLookat():{x:number; y:number; z:number; h?:number; p?:number; r?:number};
    lookatHome(duration?:number):void;
	setHome(x:number, y:number, z:number):void;	
	setHome(x:number, y:number, z:number, h:number, p:number, r:number):void;	
    createMarker(typeid:string, text:string, x:number, y:number, z:number): marker;
	removeMarker(obj:marker):boolean;
	existsMarker(obj:marker):boolean;
	createTrack(color:string, clamp:boolean, solid:boolean):track;
	removeTrack(obj:track):boolean;
	existsTrack(obj:track):boolean;
	lookatPos(x:number, y:number, z:number, duration?:number):void;	
	lookatPos(x:number, y:number, z:number, h:number, p:number, r:number, duration?:number):void;	
	lookatMarker(obj:marker, duration?:number):void;	
	getAllMarkers(typeid?:string):Array<marker>;
    clearMarkers():void;
	getAllTracks():Array<track>;
    clearTracks():void;
	tetherMarker(obj:marker):void;

	setEnableLighting(enable:boolean):void;
	getEnableLighting():boolean;
	setEnableDecluttering(enable:boolean):void;
	getEnableDecluttering():boolean;

	zoom(dx:number, dy:number):void;
	rotate(dx:number, dy:number):void;
	pan(dx:number, dy:number):void;
	enable3D(enable:boolean):void;
	enableLock(enable:boolean):void;
	enableFullscreen(enable:boolean):void;
	showMessage():void;
	hideMessage():void;

	compute_distance(x1:number, y1:number, x2:number, y2:number):number;
	compute_distance(srs:string, x1:number, y1:number, x2:number, y2:number):number;
	compute_distance(x1:number, y1:number, z1:number, x2:number, y2:number, z2:number):number;
	compute_distance(srs:string, x1:number, y1:number, z1:number, x2:number, y2:number, z2:number):number;

	setBattleTime(sec:number):void;
	getBattleTime():number;
	setBattleTimeRunning(enable:boolean):void;
	getBattleTimeRunning():boolean;
	setTimeVisible(visible:boolean):void;
	getTimeVisible():boolean;
};


//--------------------------------------------
//MARKER
//--------------------------------------------
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

//--------------------------------------------
//TRACK
//--------------------------------------------
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

