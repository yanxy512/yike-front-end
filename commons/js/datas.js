export default{
	friends:function(){
		let friendArr = [
			{
				id:1,
				img_url:'1.jpeg',
				tip:2,
				name:'苹果',
				email:'pingguo@qq.com',
				time:new Date(),
				news:'sdfdgsad',
			},
			{
				id:2,
				img_url:'2.jpeg',
				tip:3,
				name:'香蕉',
				email:'xiangjiao@qq.com',
				time:new Date(),
				news:'sdfdsfgdgsad',
			},
			{
				id:3,
				img_url:'3.jpeg',
				tip:0,
				name:'西瓜',
				email:'xigua@qq.com',
				time:new Date(),
				news:'sdfdasdf',
			},
			{
				id:4,
				img_url:'4.jpeg',
				tip:13,
				name:'草莓',
				email:'caomei@qq.com',
				time:new Date(),
				news:'szcxvbndfdgsad',
			},
			{
				id:5,
				img_url:'1.jpeg',
				tip:2,
				name:'菠萝',
				email:'boluo@qq.com',
				time:new Date(),
				news:'sdfdgsad',
			},
			{
				id:6,
				img_url:'2.jpeg',
				tip:3,
				name:'蓝莓',
				email:'lanmei@qq.com',
				time:new Date(),
				news:'sdfdsfgdgsad',
			},
			{
				id:7,
				img_url:'3.jpeg',
				tip:0,
				name:'橘子',
				email:'juzi@qq.com',
				time:new Date(),
				news:'sdfdasdfgkjlgsad',
			},
			{
				id:8,
				img_url:'4.jpeg',
				tip:13,
				name:'柚子',
				email:'youzi@qq.com',
				time:new Date(),
				news:'szcxvbndfdgsad',
			},
			{
				id:9,
				img_url:'1.jpeg',
				tip:2,
				name:'橙子',
				email:'chengzi@qq.com',
				time:new Date(),
				news:'sdfdgsad',
			},
			{
				id:10,
				img_url:'2.jpeg',
				tip:3,
				name:'猕猴桃',
				email:'mihoutao@qq.com',
				time:new Date(),
				news:'sdfdsfgdgsad',
			},
			{
				id:11,
				img_url:'3.jpeg',
				tip:0,
				name:'哈密瓜',
				email:'hamigua@qq.com',
				time:new Date(),
				news:'sdfdasdfgkjlgsad',
			},
			{
				id:12,
				img_url:'4.jpeg',
				tip:13,
				name:'梨子',
				email:'lizi@qq.com',
				time:new Date(),
				news:'szcxvbndfdgsad',
			},
		];
		return friendArr;
	},
	isFriend:function(){
		let isfriend = [
			{
				userid:1,
				friend:5,
			},
			{
				userid:1,
				friend:7,
			},
			{
				userid:1,
				friend:9,
			},
			{
				userid:1,
				friend:11,
			}
		];
		return isfriend;
	},
	message:function(){
		let msgs = [
			{
				id:'a',
				img_url:'1.jpeg',
				message:{
					name:'a',
					address:2,
					latitude:39.909,
					longitude:116.39742,
				},
				types:3,
				time:new Date()-1000,
				tip:18,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:{
					name:'a',
					address:2,
					latitude:125.261904,
					longitude:43.860655,
				},
				types:3,
				time:new Date()-1000,
				tip:17,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:{
					voice:'a',
					time:2,
				},
				types:2,
				time:new Date()-1000,
				tip:16,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:{
					voice:'a',
					time:60,
				},
				types:2,
				time:new Date()-1000,
				tip:15,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000,
				tip:0,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*16,
				tip:1,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*60,
				tip:2,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*60*36,
				tip:3,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:'8.jpeg',
				types:1,
				time:new Date()-1000*60*40,
				tip:4,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:'7.jpeg',
				types:1,
				time:new Date()-1000*60*57,
				tip:5,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:'6.jpeg',
				types:1,
				time:new Date()-1000*60*58,
				tip:6,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*60*60,
				tip:7,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*60*58*24,
				tip:8,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*60*60*24,
				tip:9,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:'5.jpeg',
				types:1,
				time:new Date()-1000*60*60*24,
				tip:10,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*60*60*24,
				tip:11,
			},
			{
				id:'a',
				img_url:'1.jpeg',
				message:'4.jpeg',
				types:1,
				time:new Date()-1000*60*60*240,
				tip:12,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*60*60*241,
				tip:13,
			},
			{
				id:'b',
				img_url:'2.jpeg',
				message:'开发的，啥可大可久多久的开发上课地方，是的开发绿色健康。上课地方叫来，都看见。',
				types:0,
				time:new Date()-1000*60*60*58*241,
				tip:14,
			},
		]
		return msgs;
	}
}