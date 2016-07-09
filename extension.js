// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var crypto = require('crypto');
var net = require('net');
var dgram = require("dgram");

var _context;

var c4_socket = new net.Socket();
var c4_handshake_socket = dgram.createSocket("udp4");


function postDataToServer(data_send){

    c4_socket.once("data", function(data){
        
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
    
    c4_socket.write(data_send);

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


function extension_fun_init(){
    if(!vscode.workspace.rootPath)
    {
        vscode.window.showErrorMessage("你尚未打开任何工作文件夹,无法进行初始化配置。");
        return;
    }

    var fs = require("fs");
    
    var dev_dir = vscode.workspace.rootPath+"/c4earth_dev";
    var vsc_dir = vscode.workspace.rootPath + "/.vscode"

    if(!fs.existsSync(dev_dir))
    {
        fs.mkdirSync(dev_dir);
    }

    if(!fs.exists(dev_dir+"/C4EARTH.d.ts")){
        fs.writeFileSync(dev_dir+"/C4EARTH.d.ts", '////// <reference path="'+_context.asAbsolutePath("data/C4EARTH.d.ts")+'" />');
    }

    if(!fs.existsSync(vsc_dir))
    {
        fs.mkdirSync(vsc_dir);
    }

    if(!fs.exists(vsc_dir+"/settings.json")){
        fs.writeFileSync(vsc_dir+"/settings.json", fs.readFileSync(_context.asAbsolutePath("data/settings.json")));
    }
}

function extension_fun_new(){
    vscode.
    vscode.window.showInformationMessage("extension_fun_new");
}

function extension_fun_connect(){

    if(c4_socket)
    {
        try{
        c4_socket.end();
        }
        catch(ex){}
    }

    var cfg = vscode.workspace.getConfiguration();

    var port = cfg.get("c4earth_port", 0xc4c4);
    var host = cfg.get("c4earth_host", "127.0.0.1");
    var password = cfg.get("c4earth_password", "");

    c4_socket = net.connect(port, host, function() {
        vscode.window.showInformationMessage("已成功连接到远程服务器，正在尝试登陆服务器...");
    });

    c4_socket.once("data",function(data){

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

        c4_socket.once("data", function(data){
            var data_str = data.toString("utf-8").replace("\0",""); 
            var ret = JSON.parse(data_str);
            if(ret && ret.success)
            {
                vscode.window.setStatusBarMessage("SOCKET已连接到 "+c4_socket.remoteAddress.toString()+":"+c4_socket.remotePort);
                vscode.window.showInformationMessage("验证登录成功!"); 
            }
            else
            {
                c4_socket.end();
                vscode.window.showErrorMessage("验证登录失败(" + host + ":" + port + ")：" + ret.error + "; 请检查settings.json配置的登录信息。"); 
            }
        });

        c4_socket.on('connect', function(){
            vscode.window.setStatusBarMessage("SOCKET已连接到 "+c4_socket.remoteAddress.toString()+":"+c4_socket.remotePort);
        });

        c4_socket.on('disconnect', function(){
            vscode.window.setStatusBarMessage("SOCKET已断开");
        });

        c4_socket.on('close', function(){
            vscode.window.setStatusBarMessage("SOCKET已关闭");
        });

        c4_socket.write('{"call":501, "password":"' + md5_str + '"}\0');

    })

}

function extension_fun_disconnect(){
    try{
        c4_socket.end();
    }
    catch(ex){}
}

function extension_fun_call(){
    if(!c4_socket.writable)
    {
        vscode.window.showErrorMessage("尚未连接到远程服务器，请先执行earth connect命令。")
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

function extension_fun_run(){
    if(!c4_socket.writable)
    {
        vscode.window.showErrorMessage("尚未连接到远程服务器，请先执行earth connect命令。")
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

function extension_fun_test(){
//    if(!c4_socket.writable)
    {
 //       vscode.window.showErrorMessage("尚未连接到远程服务器，请先执行earth connect命令。")
        //return;
    }

    var files = getTextToSend();

    console.log(files);
}

function extension_fun_findserver(){

    c4_handshake_socket.on("error", function (err) {
        vscode.window.showErrorMessage("SOCKET通信错误："+err.message);
        c4_handshake_socket.close();
    });

    c4_handshake_socket.on("message", function (msg, rinfo) {
        var str = msg.toString();
        if(str.substring(0,4)=="ISR:")
        {
            str = str.substring(4);
            var p = parseInt(str);
            if(p>0)
            {
                c4_handshake_socket.close();
                vscode.window.showInformationMessage("发现服务器：  "+ rinfo.address+" : "+p);
            }
        }
    });

    c4_handshake_socket.bind(0xc4c4);
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    _context = context;
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "c4-earth" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable;

    disposable = vscode.commands.registerCommand('extension.init', extension_fun_init);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.new', extension_fun_new);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.connect', extension_fun_connect);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.disconnect', extension_fun_disconnect);
    context.subscriptions.push(disposable);
    
    disposable = vscode.commands.registerCommand('extension.call', extension_fun_call);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.run', extension_fun_run);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.test', extension_fun_test);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.findserver', extension_fun_findserver);
    context.subscriptions.push(disposable);
}
exports.activate = activate;


// this method is called when your extension is deactivated
function deactivate() {
     try
     {
         c4_socket.end();
     }
     catch(ex){}
}

exports.deactivate = deactivate;