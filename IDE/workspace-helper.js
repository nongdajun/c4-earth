var vscode = require('vscode');
var fs = require("fs");
var _context = null;

function getDataFile(filename){
    return _context.asAbsolutePath("IDE/data/"+filename);
}

function initWorkspaceFun(force){

    if(!vscode.workspace.rootPath)
    {
        vscode.window.showErrorMessage("你尚未打开任何工作文件夹,无法进行初始化配置。");
        return;
    }
    
    var dev_dir = vscode.workspace.rootPath + "/.earth_dev";
    var vsc_dir = vscode.workspace.rootPath + "/.vscode"

    if(!fs.existsSync(dev_dir))
    {
        fs.mkdirSync(dev_dir);
    }

    if(!fs.exists(dev_dir+"/C4EARTH.d.ts") || force){
        fs.writeFileSync(dev_dir+"/C4EARTH.d.ts", '/// <reference path="' + getDataFile("C4EARTH.d.ts") + '" />');
    }

    if(!fs.existsSync(vsc_dir))
    {
        fs.mkdirSync(vsc_dir);
    }

    if(!fs.exists(vsc_dir+"/settings.json") || force){
        fs.writeFileSync(vsc_dir+"/settings.json", fs.readFileSync(getDataFile("settings.json")));
    }

    if(!fs.exists(vsc_dir+"/settings.json") || force){
        fs.writeFileSync(vsc_dir+"/settings.json", fs.readFileSync(getDataFile("settings.json")));
    }

    if(!fs.exists(vscode.workspace.rootPath + "/.earth_dev.json") || force)
    {
        fs.writeFileSync(vscode.workspace.rootPath + "/.earth_dev.json",'{\n    "ext-version":"' + vscode.extensions.getExtension("NDJ.c4isr-earth-js").packageJSON.version + '"\n}');
    }

    vscode.window.showInformationMessage("已成功初始化工作空间!");
}

exports.setContext = function(context){
    _context = context;
}

exports.initWorkspace = function(){
    initWorkspaceFun(false);
}

exports.initWorkspaceForce = function(){
    initWorkspaceFun(true);
}

exports.newFile = function(){

    var cmd;

    if(vscode.workspace.rootPath)
    {    
        cmd = "workbench.action.files.newFile";
    }
    else
    {
        cmd = "workbench.action.files.newUntitledFile";
    }

    vscode.commands.executeCommand(cmd).then(function(obj){
        
            var disp = vscode.window.onDidChangeActiveTextEditor(function(params) {
            disp.dispose();
            params.edit(function(edit) {
                edit.insert(params.document.positionAt(0), fs.readFileSync(getDataFile("sample.js")).toString("utf8"));
            }).then(function(suc) {
                console.log(suc);
            },function(rej){
                console.log(rej);
            })
        })
        _context.subscriptions.push(disp);

    });
}
