export default {
	disTime(time){
		let oldTime = new Date(time);
		let old = oldTime.valueOf();
		let newTime = new Date().valueOf();
		if(newTime - old < (24*60*60*1000)){
			let h = oldTime.getHours()
			let m = oldTime.getMinutes()
			if(h<10){
				h = '0'+h;
			}
			if(m<10){
				m = '0'+m;
			}
			time = h+':'+m;
		}else if(newTime - old < (24*60*60*1000*2)&&newTime - oldTime > (24*60*60*1000)){
			let h = oldTime.getHours()
			let m = oldTime.getMinutes()
			if(h<10){
				h = '0'+h;
			}
			if(m<10){
				m = '0'+m;
			}
			time = '昨天'+h+':'+m;
		}else{
			let y = oldTime.getFullYear();
			let m = oldTime.getMonth();
			let d = oldTime.getDate();
			time = y+'/'+m+'/'+d;
		}
		return time;
	},
	signUpTime:function(time){
		var oldTime = new Date(Date.parse(time))
		let h = oldTime.getHours();
		let m = oldTime.getMinutes();
		let y = oldTime.getFullYear();
		let mon = oldTime.getMonth()+1;
		let d = oldTime.getDate();
		if(h<10){
			h = '0'+h;
		}
		if(m<10){
			m = '0'+m;
		}
		time = y+'-'+mon+'-'+d+' '+h+':'+m
		return time
	},
	birth:function(time){
		var oldTime = new Date(Date.parse(time))
		let y = oldTime.getFullYear();
		let mon = oldTime.getMonth();
		let d = oldTime.getDate();
		if(d<10){
			d = '0'+d;
		}
		mon = mon+1
		if(mon<10){
			mon = '0'+mon
		}
		time = y+'-'+mon+'-'+d
		return time
	},
	changeTime:function(time){
		let oldTime = new Date(Date.parse(time));
		let old = oldTime.valueOf();
		let news = new Date();
		let newTime = news.valueOf();
		if(newTime - old < (24*60*60*1000)){
			let h = oldTime.getHours()
			let m = oldTime.getMinutes()
			if(h<10){
				h = '0'+h;
			}
			if(m<10){
				m = '0'+m;
			}
			time = h+':'+m;
		}else if(newTime - old < (24*60*60*1000*2)&&newTime - oldTime > (24*60*60*1000)){
			let h = oldTime.getHours()
			let m = oldTime.getMinutes()
			if(h<10){
				h = '0'+h;
			}
			if(m<10){
				m = '0'+m;
			}
			time = '昨天'+h+':'+m;
		}else{
			let y = oldTime.getFullYear();
			let mon = oldTime.getMonth()+1;
			let d = oldTime.getDate();
			let h = oldTime.getHours()
			let m = oldTime.getMinutes()
			if(h<10){
				h = '0'+h;
			}
			if(m<10){
				m = '0'+m;
			}
			if(y == news.getFullYear()){
				time = mon+'月'+d+'日 '+h+':'+m;
			}else{
				time = y+'年'+mon+'月'+d+'日 '+h+':'+m;
			}
		}
		return time;
	},
	judgetime:function(old,now){
		old = new Date(old)
		now = new Date(now)
		let oldt = old.getTime()
		let nowt = now.getTime()
		if(nowt >(oldt+1000*60*5)){
			return now;
		}else{
			return ''
		}
	},
	debounce:function(func, t) {
		let delay = t || 500;
	    let timeout;
	    return function () {
	        let args = arguments;
	        if (timeout) {
				clearTimeout(timeout);
			}
	        timeout = setTimeout(() => {
				timeout = null;
	            func.apply(this, args)
	        }, delay);
	    }
	}
}