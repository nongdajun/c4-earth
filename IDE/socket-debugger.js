var vscode = require('vscode');
var crypto = require('crypto');
var net = require('net');
var dgram = require("dgram");

var _socket = new net.Socket();
var _search_socket = dgram.createSocket("udp4");
var _search_timer = null;
var _search_status_item = vscode.window.createStatusBarItem();
var _connected_do = null;


function postDataToServer(data_send){
/*
    _socket.once("data", function(data){
        
        var data_str = data.toString("utf-8").replace("\0",""); 
        var ret;
        
        try{ 
            ret = JSON.parse(data_str);
        }
        catch(ex){ ret = {"error":"无法解析的返回结果："+data_str}; }

        if(ret && ret.success)
        {
            vscode.window.showInformationMessage("脚本执行成功!");
            console.log("脚本执行结果：\n"+ret.result);
        }
        else
        {
            vscode.window.showErrorMessage("脚本执行失败!");
            console.error("脚本执行失败：\n" + ret.error);
        }

    })
    */
    _socket.write(data_send);

}

function getTextToSend(){

    if(!vscode.window.activeTextEditor)
    {
        return null;
    }

    if(!vscode.window.activeTextEditor.selection || vscode.window.activeTextEditor.selection.isEmpty)
    {
        if(vscode.window.activeTextEditor.document.isDirty)
        {
            if(!vscode.window.activeTextEditor.document.save())
            {
                vscode.window.showInformationMessage("调试前需要先保存文件!");
                return;
            }
        }

        return vscode.window.activeTextEditor.document.getText();
    }
    else
    {
        var sel = vscode.window.activeTextEditor.selection;
        return vscode.window.activeTextEditor.document.getText(new vscode.Range(sel.start,sel.end));
    }

}

function connectServer(host, port, password){
    
    var cfg = vscode.workspace.getConfiguration();

    if(port==undefined){
        port = cfg.get("c4earth.serverPort", 0xc4c4);
    }
    if(host==undefined){
    	host = cfg.get("c4earth.serverHost", "127.0.0.1");
    }
    if(typeof(password)=="undefined"){
    	password = cfg.get("c4earth_password", "");
    }
    
    if(!password || password=="")
    {
        vscode.window.showInputBox({"prompt":"密码尚未进行配置，需要输入登录密码。", "password":true, "placeHolder":"请输入登录密码..."}).then(
            function(params) {
                connectServer_2(host, port, "md5("+params+")");
            }
        )
    }
    else{
        connectServer_2(host, port, password);
    }
}

function connectServer_2(host, port, password){

    if(_socket)
    {
        try{
        _socket.end();
        }
        catch(ex){}
    }

    try{
        _socket = net.connect(port, host, function() {
            vscode.window.showInformationMessage("已成功连接到远程服务器，正在尝试登陆服务器...");
        });
    }
    catch(ex){
        vscode.window.showErrorMessage("连接到远程服务器错误："+err.message);
        return;
    }

    _socket.on("error",function(err) {
        vscode.window.showErrorMessage("连接到远程服务器错误："+err.message);
        _search_socket.close();
        _search_status_item.hide();
        if(_search_timer){
            clearTimeout(_search_timer);
            _search_timer = null;
        }
    })

    _socket.once("data",function(data){

        vscode.window.showInformationMessage("服务器版本："+data);

        var md5_str;
    
        if(password && password.substring(0,4).toLowerCase()=="md5(" && password.charAt(password.length-1)==")")
        {
            if(password.length==5)
            {
                password = "";
            }
            else
            {
                password = password.substring(4,password.length-1);
            }
            md5_str = crypto.createHash('md5').update(password).digest('hex');
        }
        else
        {
            md5_str = password;
        }

        _socket.once("data", function(data){
            var data_str = data.toString("utf-8").replace("\0",""); 
            var ret = JSON.parse(data_str);
            if(ret && ret.success)
            {
                _socket.on("data", function(dat_ret){
                    //console.log("远程执行结果: "+dat_ret.toString("utf-8").replace("\0",""));
                    var data_str = dat_ret.toString("utf-8").replace("\0",""); 
                    var ret;
                    
                    try{ 
                        ret = JSON.parse(data_str);
                    }
                    catch(ex){ ret = {"error":"无法解析的返回结果："+data_str}; }

                    if(ret && ret.success)
                    {
                        vscode.window.showInformationMessage("脚本执行成功!");
                        console.log("脚本执行结果：\n"+ret.result);
                    }
                    else
                    {
                        vscode.window.showErrorMessage("脚本执行失败!");
                        console.error("脚本执行失败：\n" + ret.error);
                    }
                });
                vscode.window.setStatusBarMessage("SOCKET已连接到 "+_socket.remoteAddress.toString()+":"+_socket.remotePort);
                vscode.window.showInformationMessage("验证登录成功!"); 
                if(_connected_do=="call"){
                    exports.call();
                }
                else if(_connected_do=="run"){
                    exports.run();
                }
                else if(_connected_do=="abort"){
                    exports.abort();
                }
                else if(_connected_do=="reset"){
                    exports.reset();
                }
            }
            else
            {
                _socket.end();
                vscode.window.showErrorMessage("验证登录失败(" + host + ":" + port + ")：" + ret.error + "; 请检查settings.json配置的登录信息。"); 
            }
        });

        _socket.on('connect', function(){
            vscode.window.setStatusBarMessage("SOCKET已连接到 "+_socket.remoteAddress.toString()+":"+_socket.remotePort);
        });

        _socket.on('disconnect', function(){
            vscode.window.setStatusBarMessage("SOCKET已断开");
        });

        _socket.on('close', function(){
            vscode.window.setStatusBarMessage("SOCKET已关闭");
        });

        _socket.write('{"call":501, "password":"' + md5_str + '"}\0');

    })

}

function disconnectServer(){
    try{
        _socket.end();
    }
    catch(ex){}
}

function setConnectionConfig(host, port) {
    
}

exports.call = function(){

    if(!_socket.writable)
    {
        _connected_do = null;
        vscode.window.showInformationMessage("尚未连接到远程服务器，是否现在进行连接?","否", "是").then(function(params) {
           if(params=="是"){
               _connected_do = "call";
               connectServer();
           }
        });
        return;
    }

    var data = getTextToSend();

    if(data==null || data=="")
    {
         vscode.window.showWarningMessage("没有可运行的内容。")
        return;
    }

    postDataToServer(new Buffer(data+"\0","utf8"));
}

exports.run = function(){
    if(!_socket.writable)
    {
        _connected_do = null;
        vscode.window.showInformationMessage("尚未连接到远程服务器，是否现在进行连接?","否", "是").then(function(params) {
           if(params=="是"){
               _connected_do = "run";
               connectServer();
           }
        });
        return;
    }

    var data = getTextToSend();

    if(data==null || data=="")
    {
         vscode.window.showWarningMessage("没有可运行的内容。")
        return;
    }

    var send_str = '{"call":503, "script":"' + (new Buffer(data,"utf8")).toString("base64") + '"}';
    postDataToServer(new Buffer(send_str+"\0","utf8"));
}

exports.test = function(){
    console.log("HELLO");
}

exports.findserver = function(){

    if(_search_timer){
        clearTimeout(_search_timer);
        _search_timer = null;
    }

    _search_status_item.text = ">>>正在搜索C4ISR EARTH服务器...";
    _search_status_item.show();

    _search_socket.on("error", function (err) {
        vscode.window.showErrorMessage("SOCKET通信错误："+err.message);
        _search_socket.close();
        _search_status_item.hide();
        if(_search_timer){
            clearTimeout(_search_timer);
            _search_timer = null;
        }
    });

    _search_socket.on("message", function (msg, rinfo) {
        var str = msg.toString();
        if(str.substring(0,4)=="ISR:")
        {
            str = str.substring(4);
            var p = parseInt(str);
            if(p>0)
            {
                _search_socket.close();
                if(_search_timer){
                    clearTimeout(_search_timer);
                    _search_timer = null;
                }
                vscode.window.showInformationMessage("发现服务器：  "+ rinfo.address+" : "+p + " , 是否要进行连接?","连接","保存").then(function(value){
                _search_status_item.hide();
                    if(value=="保存"){
                        setConnectionConfig(rinfo.address, p);
                    }
                    else if(value=="连接"){
                        connectServer(rinfo.address, p, "");
                    }
                });
            }
        }
    });

    _search_socket.bind(0xc4c4);

    _search_timer = setTimeout(function(){
        _search_socket.close();
        _search_status_item.hide();
        vscode.window.showWarningMessage("在当前网络上未能找到任何C4ISR EARTH服务器。");
    }, 60000);

}

exports.abort = function(){
    if(!_socket.writable)
    {
        _connected_do = null;
        vscode.window.showInformationMessage("尚未连接到远程服务器，是否现在进行连接?","否", "是").then(function(params) {
           if(params=="是"){
               _connected_do = "abort";
               connectServer();
           }
        });
        return;
    }

    var send_str = '{"call":504}';
    postDataToServer(new Buffer(send_str+"\0","utf8"));
}

exports.reset = function(){
    if(!_socket.writable)
    {
        _connected_do = null;
        vscode.window.showInformationMessage("尚未连接到远程服务器，是否现在进行连接?","否", "是").then(function(params) {
           if(params=="是"){
               _connected_do = "reset";
               connectServer();
           }
        });
        return;
    }

    var send_str = '{"call":599}';
    postDataToServer(new Buffer(send_str+"\0","utf8"));
}

