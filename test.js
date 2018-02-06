Object.prototype.getType = function(){
    return Object.prototype.toString.call(this).replace(/[\[\]]/g,'').split(' ')[1];
};

Object.prototype.$iterate = function (logic) {
    if (!logic) {
        throw "No Iteration Logic Is Provided";
        return;
    }
    var typeOfObj = this.getType(),
        iterateForArray = function (toIterate, logic) {
            for (var i = 0; i < toIterate.length; i++) {
                logic(toIterate[i]);
            }
        },
        iterateForObject = function (toIterate, logic) {
            for (var key in toIterate) {
                if (toIterate.hasOwnProperty(key)) {
                    logic(key, toIterate[key]);
                }
            }
        };
    switch (typeOfObj) {
        case 'Array':
        case 'Arguments':
            iterateForArray(this, logic);
            break;
        case 'Object':
            iterateForObject(this, logic);
            break;
        default:
            throw "Non Iteratable Object";
            break;
    }
}

var check = {
    not: {},
    any: {},
    all: {}
};

check.defined = function(input){
    return input||input===0?true:false;
};

check.empty = function(input){
    if(check.defined(input)){
        switch(input.getType()){
            case 'String':
                return input.trim() === ''?true:false;
                break;
            case 'Array':
            case 'Object':
            case 'Arguments':
                let count = 0;
                input.$iterate(function(){
                    count++;
                });
                return count>0?false:true;
                break;
        }
    } else {
        return true;
    }
};

check.$update = function(){
    var $$not = function(func){
        return function(){
            return !func.apply(null, arguments);
        }
    }, $$any = function(func){
        var op = false;
        return function() {
            arguments.$iterate(function(each){
                op = op||func.call(null, each);
            });
            return op;
        }
    }, $$all = function(func){
        var op = true;
        return function() {
            arguments.$iterate(function(each){
                op = op&&func.call(null, each);
            });
            return op;
        }
    };
    check.$iterate(function(func){
        if (check[func].getType() === 'Function'|| typeof check[func] === 'function') {
            if (!check[func].supportedAPI) {
                check[func].supportedAPI = ["not","any","all"];
            }
            check[func].supportedAPI.$iterate(function(api){
                switch(api){
                    case 'not':
                        check.not[func] = $$not(check[func]);
                        break;
                    case 'any':
                        check.any[func] = $$any(check[func]);
                        break;
                    case 'all':
                        check.all[func] = $$all(check[func]);
                        break;
                    default:
                        throw "Unsupported API type";
                        break;
                }
            });
       }
    });
};
check.$update.supportedAPI=[];

//populate all interfaces
check.$update();

var test = "f";
var tempTest = ["abcd"];
console.info("test is empty "+check.empty(test));
console.info("test is not empty "+check.not.empty(test));
console.info("test and tempTest is empty "+check.all.empty(test,tempTest));
console.info("test or tempTest is empty "+check.any.empty(test,tempTest));
