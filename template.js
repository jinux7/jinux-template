(function(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory;
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jinuxTemplate"] = factory;
	else
		root["jinuxTemplate"] = factory;
})(this, function(tpl, data) {
	var template = function(tpl) {
	    var reg = /<%([\s\S]+?)%>/g;
	    
	    var index = 0; // index 用来记录替换的位置
	    
	    var func_body = "var tmp = '';"; // 需要构造的函数体
	    
	    func_body += "tmp += '";

	    tpl.replace(reg, function(match, val, offset, str){
	       
	        func_body += tpl.substring(index, offset);  // 每一次匹配到后，截取当前匹配位置和上一次匹配完成后位置之间的字符串

	        if(match.indexOf('%=') < 0) { // 根据 %= 判断如何进行拼接函数体
	            func_body +="';" + val + ";tmp += '";
	        } else {
	            func_body += "' + " + val.replace('=', '').trim() + "+'";
	        }
	        
	        index = offset + match.length; // 完成一次match，改变index 的值
	        return index;
	    });

	    func_body += tpl.substring(index);  // 完成所有匹配后，将剩下的字符串加入
	  
	    func_body += "';return tmp;"; // 返回 tmp
	    return func_body;
	};

	var jinuxTemplate = function (tpl, data) {
	    
	    var func_body = template(tpl); // 返回字符串函数体
	    
	    return new Function('data', func_body).call(null, data); // 通过 Function 运行
	};

	return jinuxTemplate(tpl, data);
});