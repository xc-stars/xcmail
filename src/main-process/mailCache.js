var LRU = require("lru-cache");
var DiskCache=require('./diskCache')
var utils=require('./utils')
var path=require('path')
var Constant=require('./Constant')
var memoryCacheOptions = { max: Constant.MEMORY_CACHE_SIZE
              , length: function (value, key) { return value.length + key.length }
              , dispose: function (key, value) { console.log('disponse '+key+" "+value) }
              , maxAge: 1000 * 60 * 60 };

var diskCacheOptions ={
	//配置disk缓存地址
	path:path.join(utils.getRootPath(),Constant.MAIL_PATH)
}
var memoryCache;
var diskCache;

//初始化内存缓存
function initMemoryCache(){
	memoryCache = LRU(memoryCacheOptions);
}
//初始化disk缓存
function initDiskCache(){


	diskCache=new DiskCache(diskCacheOptions);
	
}
//初始化缓存
exports.init=function(){
	initMemoryCache();
	initDiskCache();
}
//初始化
exports.init();
//先从内存中找。然后从硬盘中找
//从硬盘中找到后再放到内存缓存中
exports.get=function(key){
	var memValue=memoryCache.get(key);
	//如果从内存中找到目标
	if(memValue)return memValue;
	var diskValue=diskCache.get(key);

	//如果在disk-cache中找到，缓存至内存中
	if(diskValue) exports.set(key,diskValue);
	//返回value
	return diskValue;
}
//放到内存中
exports.set= function(key,value){
	memoryCache.set(key,value)
}
//放到硬盘和内存缓存中。仅仅在需要调用fetch时才调用这个方法，默认情况下不进行硬盘缓存
exports.setDiskAndMemory = function(key,value){
	diskCache.set(key,value);
	memoryCache.set(key,value)
}
