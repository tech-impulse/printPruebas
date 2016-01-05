/**
 * Printer Plugin
 * Copyright (c) 2011 Ian Tipton (github.com/itip)
 * MIT licensed
 */

navigator.printer = {};
navigator.printer.callbackMap = {};

/*
 print      - html string or DOM node (if latter, innerHTML is used to get the contents). REQUIRED.
 success    - callback function called if print successful.     {success: true}
 fail       - callback function called if print unsuccessful.  If print fails, {error: reason}. If printing not available: {available: false}
 options    -  {dialogOffset:{left: 0, right: 0}}. Position of popup dialog (iPad only).
 */
var print = function(printHTML, options, success, fail) {
    if (typeof printHTML != 'string'){
        console.log("Print function requires an HTML string. Not an object");
        return;
    }

    var dialogLeftPos = 0;
    var dialogTopPos = 0;
    var isLandscape = false;
    var args = [];
    args.push(printHTML);


    if (options){
        if (options.dialogOffset){
            if (options.dialogOffset.left){
                dialogLeftPos = options.dialogOffset.left;
                if (isNaN(dialogLeftPos)){
                    dialogLeftPos = 0;
                }
            }
            if (options.dialogOffset.top){
                dialogTopPos = options.dialogOffset.top;
                if (isNaN(dialogTopPos)){
                    dialogTopPos = 0;
                }
            }
        }
        if(options.landscape) {
            isLandscape = true;
            args.push(isLandscape);
        }
        if(options.maximumContentWidth) {
            args.push(options.maximumContentWidth);
        }
        if(options.maximumContentHeight) {
            args.push(options.maximumContentHeight);
        }
    }

    var key = 'print' + this.callbackIdx++;
    navigator.printer.callbackMap[key] = {
        success: function(result) {
            delete navigator.printer.callbackMap[key];
            success(result);
        },
        fail: function(result) {
            delete navigator.printer.callbackMap[key];
            fail(result);
        },
    };

    var callbackPrefix = 'navigator.printer.callbackMap.' + key;
    cordova.exec(success, fail, "PrintPlugin", "print", args);
};

/*
 * Callback function returns {available: true/false}
 */
var isPrintingAvailable = function(callback) {
    var key = 'isPrintingAvailable' + this.callbackIdx++;
    navigator.printer.callbackMap[key] = function(result) {
        delete navigator.printer.callbackMap[key];
        callback(result);
    };

    var callbackName = 'navigator.printer.callbackMap.' + key;
    cordova.exec(callback, callback, "PrintPlugin", "isPrintingAvailable");
};

navigator.printer.print = print;
navigator.printer.isPrintingAvailable = isPrintingAvailable;

module.exports = navigator.printer;