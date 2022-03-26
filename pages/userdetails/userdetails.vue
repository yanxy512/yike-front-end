<template>
	<view class="content">
		<view class="tap-bar">
			<view class="tap-bar-left">
				<image src="../../static/images/userhome/left.png" mode="" @tap='BackOne()'></image>
			</view>
			<view class="tap-bar-center">
				详细
			</view>
		</view>
		<view class="user-box">
			<view class="head-box">
				<view class="word">
					头像
				</view>
				<view class="head" v-if='id == uid'>
					<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @tap="upload" class="meslist_img"></image>
				</view>
				<view class="head" v-if='id !==uid'>
					<image :src="cropFilePath" class="meslist_img"></image>
				</view>
				<view class="more" v-if='id == uid'>
					<image src="../../static/images/userdetails/left.png" mode="" ></image>
				</view>
			</view>
			<view class="box" @tap="showModify('签名',user.news,false,'news')">
				<view class="word">
					签名
				</view>
				<view class="text">
					{{user.news}}
				</view>
				<view class="more" v-if='id == uid'>
					<image src="../../static/images/userdetails/left.png" mode=""></image>
				</view>
			</view>
			<view class="box">
				<view class="word">
					注册
				</view>
				<view class="text">
					{{signTime(user.time)}}
				</view>
			</view>
		</view>
		<view class="information-box">
			<view class="box" @tap="showModify1('昵称',user.nick,false,'nick')" v-if='id!==uid&&isFri==true'>
				<view class="word">
					昵称
				</view>
				<view class="text">
					{{user.nick}}
				</view>
				<view class="more">
					<image src="../../static/images/userdetails/left.png" mode=""></image>
				</view>
			</view>
			<view class="box">
				<view class="word">
					性别
				</view>
				<view class="text" v-if="id==uid">
					<picker @change="bindPickerChange" :value="index" :range="array" style="width: 100%;">
						<view class="uni-input" >{{array[index]}}</view>
					</picker>
				</view>
				<view class="text" v-if='id!==uid'>
					<view class="uni-input" >
						{{array[index]}}
					</view>
				</view>
				<view class="more" v-if='id == uid'>
					<image src="../../static/images/userdetails/left.png" mode=""></image>
				</view>
			</view>
			<view class="box">
				<view class="word">
					生日
				</view>
				<view class="text" v-if='id == uid'>
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" style="width: 100%;">
						<view class="uni-input">{{date}}</view>
					</picker>
				</view>
				<view class="text" v-if='id !== uid'>
					<view class="uni-input">{{date}}</view>
				</view>
				<view class="more" v-if='id == uid'>
					<image src="../../static/images/userdetails/left.png" mode=""></image>
				</view>
			</view>
			<view class="box" @tap="showModify('电话',user.phone,true,'phone')">
				<view class="word">
					电话
				</view>
				<view class="text">
					{{user.phone}}
				</view>
				<view class="more" v-if='id == uid'>
					<image src="../../static/images/userdetails/left.png" mode=""></image>
				</view>
			</view>
			<view class="box" @tap="showModify('邮箱',user.email,true,'email')">
				<view class="word">
					邮箱
				</view>
				<view class="text">
					{{user.email}}
				</view>
				<view class="more" v-if='id == uid'> 
					<image src="../../static/images/userdetails/left.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="password-box" @tap="showModify('密码','',true,'psw')" v-if='id == uid'>
			<view class="box">
				<view class="word">
					密码
				</view>
				<view class="text">
					.........
				</view>
				<view class="more" v-if='id == uid'>
					<image src="../../static/images/userdetails/left.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="btn" v-if='id ==uid' @tap='logOut()'>
			退出登录
		</view>
		<view class="btn" v-if='id!==uid' @tap='deleteFriend()'>
			删除好友
		</view>
		<view class="modify" :animation="animationData">
			<view class="tap-bar">
				<view class="tap-bar-left" @tap="showModify()">
					取消
				</view>
				<view class="tap-bar-center">
					{{centerText}}
				</view>
				<view class="tap-bar-right" @tap='check(oldvalue,type,psw)'>
					确定
				</view>
			</view>
			<view class="modify-text">
				<input type="password" value="" class='old-psw'placeholder="请输入原密码" v-if="isOldPsw" v-model='psw'/>
				<textarea value="" placeholder="" class="change-text" v-model="oldvalue"/>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import myfunc from "@/commons/js/myfunc.js"
	import store from '@/store/index.js';
	import config from '../../commons/js/config.js'
	
	export default {
		data() {
			const currentDate = this.getDate({
			    format: true
			})
			return {
				id:'',
				uid:store.state.userID,
				array: ['男', '女', '未知'],
				type:'',
				psw:'',
				index: 0,
				date: currentDate,
				tempFilePath: "",
				cropFilePath: "",
				user:{
					name:'草莓',
					nick:'hap',
					sex:'男',
					phone:'12345678',
					email:'1234567@qq.com',
					time:new Date(),
					news:'',
				},
				animationData: {},
				isModify:false,
				isOldPsw:false,
				isFri:false,
				centerText:'',
				oldvalue:'12345',
			};
		},
		onLoad:function(e){
			this.id = e.id
			this.getUserInfo()
			if(this.id !== this.uid){
				this.getNick()
				this.isFriend()
			}
		},
		components: {
		    ImageCropper,
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			checkEmail:function(){
				if(this.emailValue!==''){
					var reg = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
					if(reg.test(this.emailValue)){
					
					}
				}
			},
			getUserInfo:function(){
				uni.request({
					url:'/user/details',
					data:{
						id:this.id,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						let res = data.data.result;
						if(code == 200){
							this.user = res
							this.getsex(res.sex)
							this.cropFilePath = config.baseURL() + res.img_url
							if(!res.nick){
								this.user.nick = res.name
							}
							if(!res.news){
								this.user.news = '这个人很懒，什么都没有留下~'
							}
							if(!res.birth){
								this.date = '0000-00-00'
							}else{
								this.date = myfunc.birth(res.birth)
							}
						}else if(code == 300){
							uni.showToast({
								icon:'none',
								title:'请重新登录',
								duration:2000
							})
							uni.navigateTo({
								url:'../signin/signin'
							})
						}else if(code == 400){
							
						}else{
							uni.showToast({
								icon:'none',
								title:'服务器错误',
								duration:2000
							})
						}
					},
				})
			},
			getNick:function(){
				uni.request({
					url:'/user/getfriendnick',
					data:{
						uID:this.uid,
						fID:this.id,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						if(code == 200){
							if(data.data.result.nick){
								this.user.nick = data.data.result.nick
							}
						}else if(code == 300){
							uni.showToast({
								icon:'none',
								title:'请重新登录',
								duration:2000
							})
							uni.navigateTo({
								url:'../signin/signin'
							})
						}else if(code == 400){
						}else{
							uni.showToast({
								icon:'none',
								title:'服务器错误',
								duration:2000
							})
						}
					},
				})
			},
			changeNick:function(){
				uni.request({
					url:'/user/friendnick',
					data:{
						uID:this.uid,
						fID:this.id,
						nick:this.user.nick,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						if(code == 200){
							uni.showToast({
								icon:'none',
								title:'修改成功',
								duration:2000
							})
						}else if(code == 300){
							uni.showToast({
								icon:'none',
								title:'请重新登录',
								duration:2000
							})
							uni.navigateTo({
								url:'../signin/signin'
							})
						}else if(code == 400){
						}else{
							uni.showToast({
								icon:'none',
								title:'服务器错误',
								duration:2000
							})
						}
					},
				})
			},
			isFriend:function(e){
				uni.request({
					url:'/search/isfriend',
					data:{
						uID:this.uid,
						fID:this.id,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						if(code == 200){
							this.isFri = true
						}else if(code == 300){
							uni.showToast({
								icon:'none',
								title:'请重新登录',
								duration:2000
							})
							uni.navigateTo({
								url:'../signin/signin'
							})
						}else if(code == 400){
							
						}else{
							uni.showToast({
								icon:'none',
								title:'服务器错误',
								duration:2000
							})
						}
					}
				})
			},
			//判断用户性别
			getsex:function(e){
				if(e == 'female'){
					this.index = 1
				}else if(e == 'male'){
					this.index = 0 
				}else{
					this.index = 2
				}
			},
			bindPickerChange: function(e) {
				// console.log(e.target.value)
				var oldindex = this.index;
				this.index = e.target.value;
				if(oldindex !== this.index){
					var sex = '';
					if(this.index == 1){
						sex = 'female'
					}else if(this.index == 0){
						sex = 'male'
					}else{
						sex = 'unknown'
					}
					this.check(sex,'sex')
				}
			},
			bindDateChange: function(e) {
				var oldvalue = this.date
				this.date = e.target.value
				if(oldvalue !== this.date){
					this.check(e.target.value,'birth')
				}
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			upload() {
			    uni.chooseImage({
			        count: 1, //默认9
			        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
			        sourceType: ["album","camera"], //从相册选择
			        success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift();
			        },
			    });
			},
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				//除了H5端返回base64数据外，其他端都是返回临时地址，所以你要判断base64还是临时文件名，（用条件编译APP-PLUS||MP执行编译。）
				//按我这里是先上传裁剪得来的临时文件地址然后得到临时文件名，
				//待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK
				uni.uploadFile({
					url: "/file/upload",
					filePath: this.cropFilePath,
					name: "file",
					fileType: "image",
					formData:{
						url:'user',
						name:this.uid,
					},
					success: (uploadFileRes) => {
					  var backstr = uploadFileRes.data;
					  store.commit("changeUserImg", backstr);
					  this.update(backstr,'img_url')
					},
			
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});
			},
			cancel() {
				console.log("canceled");
				this.tempFilePath = "";
			},
			update:function(d,t,p){
				uni.request({
					url:'/user/update',
					data:{
						id:this.uid,
						data:d,
						type:t,
						psw:p,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						if(code == 200){
							this.psw = ''
							uni.showToast({
								icon:'none',
								title:'修改成功',
								duration:2000
							})
							this.user[t]=d
						}else if(code == 300){
							uni.showToast({
								icon:'none',
								title:'请重新登录',
								duration:2000
							})
							uni.navigateTo({
								url:'../signin/signin'
							})
						}else if(code == 201){
							uni.showToast({
								icon:'none',
								title:'已占用',
								duration:2000
							})
						}else if(code == 202){
							uni.showToast({
								icon:'none',
								title:'密码错误',
								duration:2000
							})
						}else{
							uni.showToast({
								icon:'none',
								title:'服务器错误',
								duration:2000
							})
						}
					},
				})
			},
			showModify:function(text,oldvalue,isPsw,type){
				this.psw=''
				if(this.id == this.uid){	
					this.centerText = text
					this.oldvalue = oldvalue
					this.isOldPsw = isPsw
					this.type = type
					this.isModify = !this.isModify
					var animation = uni.createAnimation({
					    duration: 500,
					    timingFunction: 'ease',
					})
					if(this.isModify){
						animation.bottom(0).step()
					}else{
						animation.bottom(-2000).step()
					}
					this.animationData = animation.export()
				}
			},
			showModify1:function(text,oldvalue,isPsw,type){
				if(this.isFri == true){
					this.type = type
					this.centerText = text
					this.oldvalue = oldvalue
					this.isOldPsw = isPsw
					this.isModify = !this.isModify
					var animation = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease',
					})
					if(this.isModify){
						animation.bottom(0).step()
					}else{
						animation.bottom(-2000).step()
					}
					this.animationData = animation.export()
				}
			},
			check:function(text,type,psw){
				var oldvalue = this.user[type]
				var newvalue = text
				if(text.length > 0 && oldvalue !== newvalue){
					if(type == 'nick' && this.id !== this.uid){
						if(this.isFri == true){
							console.log(text,type)
							this.showModify1()
							this.user.nick = text
							this.changeNick()
						}
					}
					if(type !== 'sex' && type!== 'birth'){
						if(type == 'email'&&psw !== ''){
							this.showModify()
							var reg = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
							if(reg.test(text)){
								this.update(text,type,psw)
							}else{
								uni.showToast({
									icon:'none',
									title:'邮箱格式不正确',
									duration:2000
								})
							}
						}
						if((type == 'phone'&&psw !=='')||(type == 'psw'&&psw!=='')){
							this.showModify()
							this.update(text,type,psw)
						}
						if(type!=='phone'&&type!=='email'&&type!=='psw'){
							this.showModify()
							this.update(text,type)
						}
					}else{
						this.update(text,type)
					}
				}
			},
			signTime:function(time){
				return myfunc.signUpTime(time)
			},
			BackOne:function(){
				uni.navigateBack({
					delta:1
				})
			},
			logOut:function(){
				store.commit("changeUserID", '');
				store.commit("changeUserName", '');
				store.commit("changeUserPassword", '');
				store.commit("changeUserImg", '');
				store.commit("changeUserToken", '');
				uni.navigateTo({
					url:'../signin/signin'
				})
			},
			deleteFriend:function(){
				uni.showModal({
					title: '提示',
					content: '确定删除这个好友吗？',
					success:  (res)=> {
						if (res.confirm) {
							uni.request({
								url:'/friend/deletefriend',
								data:{
									uid:this.uid,
									fid:this.id,
								},
								method:'POST',
								success:(data)=>{
									let code = data.data.code;
									if(code == 200){
										uni.navigateTo({
											url:'../index/index?id='+this.uid
										})
									}else if(code == 300){
										uni.showToast({
											icon:'none',
											title:'请重新登录',
											duration:2000
										})
										uni.navigateTo({
											url:'../signin/signin'
										})
									}else if(code == 400){
									}else{
										uni.showToast({
											icon:'none',
											title:'服务器错误',
											duration:2000
										})
									}
								},
							})
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		},
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
	}
	.tap-bar{
		z-index:1000;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		width: 100%;
		background: $uni-bg-color;
		box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
		.tap-bar-left{
			position: absolute;
			left:$uni-spacing-col-base;
			image{
				width: 48rpx;
				height: 48rpx;
			}
		}
		.tap-bar-center{
			// padding-top:var(--status-bar-height);
			width: 78rpx;
			height: 56rpx;
			font-family: PingFangSC-Regular;
			font-size: 40rpx;
			color: #272832;
			letter-spacing: -0.69rpx;
			font-weight: 400;
		}
	}
	.user-box{
		box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
		height: 436rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction:column ;
		.head-box{
			margin-top: 42rpx;
			height: 148rpx;
			width: 100%;
			display: flex;
			align-items: center;
			.word{
				padding: 0 32rpx 0 32rpx;
				width: 62rpx;
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #272832;
				letter-spacing: -0.55rpx;
				font-weight: 400;
			}
			.head{
				flex:1;
				display: flex;
				align-items: center;
				image{
					width: 108rpx;
					height: 108rpx;
					border-radius: 20rpx;
				}
			}
			.more{
				padding-right: 26rpx;
				image{
					width: 28rpx;
					height: 28rpx;
					opacity: 0.3;
					transform: rotate(-180deg);
				}
			}
		}
		.box{
			height: 148rpx;
			width: 100%;
			display: flex;
			align-items: center;
			.word{
				padding: 0 32rpx 0 32rpx;
				width: 62rpx;
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #272832;
				letter-spacing: -0.55rpx;
				font-weight: 400;
			}
			.text{
				display: -webkit-box;
				-webkit-box-orient: vertical;    
				-webkit-line-clamp: 1;    
				overflow: hidden; 
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: rgba(39,40,50,0.60);
				letter-spacing: -0.55rpx;
				font-weight: 400;
				flex:1;
			}
			.more{
				padding-right: 26rpx;
				image{
					width: 28rpx;
					height: 28rpx;
					opacity: 0.3;
					transform: rotate(-180deg);
				}
			}
		}
	}
	.information-box{
		margin-top: 12rpx;
		box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
		height: 596rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction:column ;
		.box{
			height: 148rpx;
			width: 100%;
			display: flex;
			align-items: center;
			.word{
				padding: 0 32rpx 0 32rpx;
				width: 62rpx;
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #272832;
				letter-spacing: -0.55rpx;
				font-weight: 400;
			}
			.text{
				display: -webkit-box;
				-webkit-box-orient: vertical;    
				-webkit-line-clamp: 1;    
				overflow: hidden; 
				word-break: break-all;
				word-wrap: break-word;
				white-space: normal;
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: rgba(39,40,50,0.60);
				letter-spacing: -0.55rpx;
				font-weight: 400;
				flex:1;
				display: flex;
				align-items: center;
			}
			.more{
				padding-right: 26rpx;
				image{
					width: 28rpx;
					height: 28rpx;
					opacity: 0.3;
					transform: rotate(-180deg);
				}
			}
		}
	}
	.password-box{
		margin-top: 12rpx;
		box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
		height: 112rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction:column ;
		.box{
			height: 148rpx;
			width: 100%;
			display: flex;
			align-items: center;
			.word{
				padding: 0 32rpx 0 32rpx;
				width: 62rpx;
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #272832;
				letter-spacing: -0.55rpx;
				font-weight: 400;
			}
			.text{
				display: -webkit-box;
				-webkit-box-orient: vertical;    
				-webkit-line-clamp: 1;    
				overflow: hidden; 
				word-break: break-all;
				word-wrap: break-word;
				white-space: normal;
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: rgba(39,40,50,0.60);
				letter-spacing: -0.55rpx;
				font-weight: 400;
				flex:1;
				display: flex;
				align-items: center;
			}
			.more{
				padding-right: 26rpx;
				image{
					width: 28rpx;
					height: 28rpx;
					opacity: 0.3;
					transform: rotate(-180deg);
				}
			}
		}
	}
	.btn{
		padding-top: 160rpx;
		width: 684rpx;
		height: 80rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 80rpx;
		font-family: PingFangSC-Regular;
		font-size: 32rpx;
		color: #FF5D5B;
		letter-spacing: -0.55rpx;
		font-weight: 400;
	}
	.modify{
		z-index: 1002;
		height: 100%;
		width: 100%;
		background-color: white;
		position: fixed;
		bottom: -2000px;
		.tap-bar{
			z-index:1003;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			width: 100%;
			background: $uni-bg-color;
			box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
			.tap-bar-left{
				position: absolute;
				left:$uni-spacing-col-base;
				width: 62rpx;
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #272832;
				letter-spacing: -0.55rpx;
				font-weight: 400;
			}
			.tap-bar-center{
				font-family: PingFangSC-Regular;
				font-size: 40rpx;
				color: #272832;
				letter-spacing: -0.69rpx;
				font-weight: 400;
			}
			.tap-bar-right{
				position: absolute;
				right: $uni-spacing-col-base;
				width: 62rpx;
				height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #4AAAFF;
				letter-spacing: -0.55rpx;
				font-weight: 400;
			}
		}
		.modify-text{
			margin: 34rpx 32rpx 0;
			// display: flex;
			// align-items: center;
			// flex-wrap: wrap;
			.old-psw{
				box-sizing: border-box;
				padding: 0 22rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #272832;
				letter-spacing: -0.55rpx;
				font-weight: 400;
				width: 686rpx;
				height: 118rpx;
				background: #F3F4F6;
				border-radius: 20rpx;
				margin-bottom: 16rpx;
			}
			.change-text{
				padding: 16rpx 22rpx;
				box-sizing: border-box;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #272832;
				letter-spacing: -0.55rpx;
				font-weight: 400;
				width: 686rpx;
				height: 386rpx;
				background: #F3F4F6;
				border-radius: 20rpx;
			}
		}
	}
</style>
