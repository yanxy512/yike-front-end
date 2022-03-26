<template>
	<view class="content">
		<view class="tap-bar">
			<view class="tap-bar-left" @tap='toIndex()'>
				<image src="../../static/images/chatroom/left.png" mode=""></image>
			</view>
			<view class="tap-bar-center">
				{{user.name}}
			</view>
			<view class="tap-bar-right" v-show='user.type == 0'>
				<image src="" mode=""></image>
			</view>
			<view class="tap-bar-right" v-show='user.type == 1' @tap = 'toGroupHome()'>
				<image :src="user.img_url" mode=""></image>
			</view>
		</view>
		<scroll-view class="main" :scroll-into-view="scrollIntoView" scroll-y="true" scroll-with-animation="true" :scroll-top="scrollTop" @scrolltoupper="loading()">
			<view :style="{paddingBottom:inputHeight+'px'}">
				<view class="loading" :animation="animationData" v-if="isL">
					<image src="../../static/images/submit/loading.png" mode=""></image>
				</view>
				<view class="chat-box" v-for="(item,index) in msg" :key = 'index' :id="'msg'+item.id" >
					<view class="time" v-if='item.time!==""'>
						{{changeTime(item.time)}}
					</view>
					<view class="chat-left" v-if = "item.fromID == user.id">
						<view>
							<image :src="item.img_url" mode="" class="img-url"></image>
						</view>
						<view class="chat-text-left" v-if="item.types==0">
							{{item.message}}
						</view>
						<view v-if="item.types==1" @tap="previewImage(item.message)">
							<image :src="item.message" mode="widthFix" class="img-msg"></image>
						</view>
						<view class="chat-img-left" v-if="item.types==2" :style="{width:item.message.time*4+'px'}" @tap='playVoice(item.message.voice)'>
							<image src="../../static/images/submit/sound.png" mode=""></image>
							{{item.message.time}}″
						</view>
						<view  class="chat-map-left" v-if="item.types==3" @tap="openLocation(item.message)">
							<view class="chat-map-left-name">
								{{item.message.name}}
							</view>
							<view class="chat-map-left-address">
								{{item.message.address}}
							</view>
							<view class="map">
								<image src="../../static/images/submit/map.jpeg" mode="scaleToFill"></image>
							</view>
<!-- 							<map class='map':longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)" >
							</map> -->
						</view>
					</view>
					<view class="chat-right" v-if="item.fromID == user.uid">
						<view>
							<image  :src="item.img_url" mode="" class="img-url"></image>
						</view>
						<view  class="chat-text-right" v-if="item.types==0">
							{{item.message}}
						</view>
						<view  v-if="item.types==1" @tap='previewImage(item.message)'>
							<image :src="item.message" mode="widthFix" class="img-msg"></image>
						</view>
						<view  class="chat-img-right" v-if="item.types==2" :style="{width:item.message.time*4+'px'}" @tap='playVoice(item.message.voice)'>
							{{item.message.time}}″
							<image src="../../static/images/submit/sound.png" mode=""></image>
						</view>
						<view  class="chat-map-right" v-if="item.types==3" @tap="openLocation(item.message)">
							<view class="chat-map-right-name">
								{{item.message.name}}
							</view>
							<view class="chat-map-right-address">
								{{item.message.address}}
							</view>
							<view class="map">
								<image src="../../static/images/submit/map.jpeg" mode="scaleToFill"></image>
							</view>
						<!-- 	<map class='map':longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)" >
							</map> -->
						</view>
					</view>
				</view>
			</view>
		</scroll-view>	
		<submit @inputs='inputs' @sumbitHeight='sumbitHeight'></submit>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfunc from '../../commons/js/myfunc.js'
	import submit from '../../components/submit/submit.vue'
	import store from '../../store/index.js'
	import config from '../../commons/js/config.js'
	const innerAudioContext = uni.createInnerAudioContext();
	
	export default {
		data() {
			return {
				user:{
					uid:store.state.userID,
					uimg_url:store.state.userImg,
					id:'',
					img_url:'',
					type:'',
					name:'',
				},
				name:store.state.userName,
				nowPage:0,
				pageSize:10,
				msg:[],
				imgArr:[],
				oldTime:'',
				nowTime:'',
				scrollIntoView:'',
				inputHeight:'150',
				scrollTop:'',
				animationData: {},
				loadingTime:'',
				isL:false,
				socketid:'',
			};
		},
		onLoad:function(e){
			this.user.id = e.id
			this.user.img_url = e.img_url
			this.user.name = e.name
			this.user.type = e.type
			this.socketid = e.socketid
			this.getMsgs(this.pageNumber)
			this.loading()
			this.receiveSocketMsg()
			this.receiveSocketGroupMsg()
		},
		comments:{
			submit,
		},
		methods:{
			loading: function(){
				if(this.pageNumber > 0){
					this.isL = true;
					var animation = uni.createAnimation({
						duration: 1000,
					    timingFunction: 'step-start',
					})
					this.animation = Animation
					let i = 1;
					this.loadingTime = setInterval(function() {
					  i++;
					  animation.rotate(30*i).step()
					  this.animationData = animation.export()
					  if(i>10){
						  clearInterval(this.loadingTime)
						  this.getMsgs(this.pageNumber)
						  this.isL = false
					  }
					}.bind(this), 100)
				}
			},
			toIndex:function(){
				uni.navigateBack({
				    delta: 1
				});
			},
			getMsgs:function(){
				uni.request({
					url:'/chat/getpagingmessage',
					data:{
						uid:this.user.uid,
						fid:this.user.id,
						nowPage:this.nowPage,
						pageSize:this.pageSize,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						let msgArr = data.data.result;
						msgArr.reverse()
						if(code == 200){
							if(msgArr.length>0){
								let oldtime = msgArr[0].time;
								let imgArr = []
								for(var i = 1;i<msgArr.length;i++){
									if(i<msgArr.length-1){
										let t = myfunc.judgetime(oldtime,msgArr[i].time)
										if(t){
											oldtime = t
										}
										msgArr[i].time = t
									}
									if(this.nowPage==0){
										if(msgArr[i].time>this.oldTime){
											this.oldTime = msgArr[i].time;
										}
									}
									if(msgArr[i].types == '1'){
										msgArr[i].message = config.baseURL()+msgArr[i].message;
										imgArr.push(msgArr[i].message)
									}
									if(msgArr[i].types == '3'){
										msgArr[i].message = JSON.parse([i].message);
									}
								}
								this.msg = msgArr.concat(this.msg)
								this.imgArr = imgArr.concat(this.imgArr)
							}
							if(msgArr.length == 10){
								this.nowPage++
							}else{
								this.nowPage = -1
							}
							this.$nextTick(function(){
									if(this.msg.length >0){
										this.scrollIntoView = 'msg'+this.msg[msgArr.length-1].id;
									}
								})
							clearInterval(this.loadingTime)
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
			changeTime:function(time){
				return myfunc.changeTime(time);
			},
			previewImage:function(e){	
				uni.previewImage({
					current:e,
					urls: this.imgArr,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			inputs:function(e){
				this.receive(e,this.user.uid,this.user.uimg_url,0)
			},
			//接受消息
			receive:function(e,id,img,tip){
				if(e.types == 0||e.types == 3){
					this.sendSocket(e)
				}
				if(e.types == 1){
					let url = 'chat'+id
					this.imgArr.push(e.message)
					uni.uploadFile({
						url: "/file/upload",
						filePath: e.message,
						name: "file",
						formData:{
							url:url,
							name:new Date().getTime()+this.user.uid+Math.ceil(Math.random()*10),
						},
						success: (uploadFileRes) => {
						  let data = {
							  message:uploadFileRes,
							  types:e.types,
						  }
						  this.sendSocket(data)
						},
					})
				}
				if(e.types == 2){
					uni.uploadFile({
						url: "/file/upload",
						filePath: e.message.voice,
						name: "file",
						formData:{
							url:'chat'+id,
							name:new Date().getTime()+this.user.uid+Math.ceil(Math.random()*10),
						},
						success: (uploadFileRes) => {
						  let data = {
							  message:uploadFileRes,
							  types:e.types,
						  }
						  console.log(uploadFileRes)
						  this.sendSocket(data)
						},
					})
				}
				//tip=0自己 tip=1 别人
				let len = this.msg.length;
				let nowtime = new Date()
				let t = myfunc.judgetime(this.oldTime,nowtime)
				if(t){
					this.oldTime = t
				}
				nowtime=t;
				if(e.types == 3){
					e.message = JSON.parse(e.message)
				}
				let data = {
						fromID:id,//用户id
						img_url:img,
						message:e.message,
						types:e.types, //内容类型（0文字，1图片链接，2音频链接...）
						time:nowtime,//发送时间
						id:len,
					}
				this.msg.push(data)
				this.goBottom()
				// this.$nextTick(function(){
				// 	this.getElementHeight()
				// })
			},
			//聊天数据发送后端
			sendSocket:function(e){
				if(this.user.type == 0){
					this.socket.emit('msg',e,this.user.uid,this.user.id)
				}else{
					this.socket.emit('groupMsg',e,this.user.uid,this.user.id,this.name,this.user.uimg_url)
				}
			},
			//socket聊天数据接收
			receiveSocketMsg:function(){
				this.socket.on('msg',(msg,fromid,tip)=>{
					if(fromid == this.user.id&&tip==0){
						let len = this.msg.length;
						let nowtime = new Date()
						let t = myfunc.judgetime(this.oldTime,nowtime)
						if(t){
							this.oldTime = t
						}
						if(msg.types == 1||msg.types ==2){
							msg.message = config.baseURL()+msg.message.data
						}
						nowtime=t;
						let data = {
								fromID:fromid,//用户id
								img_url:this.user.img_url,
								message:msg.message,
								types:msg.types, //内容类型（0文字，1图片链接，2音频链接...）
								time:new Date(),//发送时间
								id:len,
							}
						this.msg.push(data)
						if(msg.types == 1){
							this.imgArr.push(msg.message)
						}
						this.goBottom()
					}
				})
			},
			receiveSocketGroupMsg:function(){
				this.socket.on('groupmsg',(msg,fromid,tip,name,img_url)=>{
					if(fromid == this.user.id&&tip==0){
						let len = this.msg.length;
						let nowtime = new Date()
						let t = myfunc.judgetime(this.oldTime,nowtime)
						if(t){
							this.oldTime = t
						}
						if(msg.types == 1||msg.types ==2){
							msg.message = config.baseURL()+msg.message.data
						}
						console.log(msg.message)
						nowtime=t;
						let data = {
								fromID:fromid,//用户id
								img_url:img_url,
								message:msg.message,
								types:msg.types, //内容类型（0文字，1图片链接，2音频链接...）
								time:new Date(),//发送时间
								id:len,
							}
						this.msg.push(data)
						if(msg.types == 1){
							this.imgArr.push(msg.message)
						}
						this.goBottom()
					}
				})
			},
			sumbitHeight:function(e){
				this.inputHeight = e;
				setTimeout(()=>{
					this.goBottom()
				},0)
			},
			goBottom:function(){
				if(this.msg.length >0){
					this.scrollIntoView = '';
					this.$nextTick(function(){
						let len = this.msg.length-1;
						this.scrollIntoView = 'msg'+this.msg[len].id;
					})
				}
			},
			playVoice(e) {
				if (e) {
			        innerAudioContext.src = e;
			        innerAudioContext.play();
				}
			},
			covers:function(e){
				let map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/submit/map.png'
				}]
				return map;
			},
			openLocation:function(e){
				uni.openLocation({
					name:e.name,
					address:e.address,
				    latitude: e.latitude,
				    longitude: e.longitude,
				    success: function () {
				        console.log('success');
				    }
				});
			},
			toGroupHome:function(){
				uni.navigateTo({
					url:'../grouphome/grouphome?id='+this.id
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.content{
		height: 100%;
		background:#F4F4F4;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
	}
	.tap-bar{
		z-index:1000;
		position: fixed;
		top:0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		width: 100%;
		background: #F4F4F4;;
		box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
		.tap-bar-left{
			padding-left:24rpx;
			image{
				width: 68rpx;
				height: 68rpx;
				border-radius: 32rpx;
			}
		}
		.tap-bar-center{
			// padding-top:var(--status-bar-height);
			height: 56rpx;
			font-family: PingFangSC-Regular;
			font-size: 40rpx;
			color: #272832;
			letter-spacing: -0.69rpx;
			font-weight: 400;
		}
		.tap-bar-right{
			padding-right: 32rpx;
			image{
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
			}
		}
	}
	.main{
		margin-top: 96rpx;
		// padding-bottom: 120rpx;
		// margin-bottom: 100rpx;
		background:#F4F4F4;
		height: 100%;
		.loading{
			display: flex;
			align-items: center;
			justify-content: center;
			image{
				width: 60rpx;
				height: 60rpx;
			}
		}
		.chat-box{
			width: 100%;
			.time{
				padding: 20rpx 0;
				width: 100%;
				text-align: center;
				height: 34rpx;
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				color: rgba(39,40,50,0.30);
				letter-spacing: -0.41rpx;
				font-weight: 400;
			}
			.chat-left{
				padding: 20rpx 0;
				display: flex;
				margin-left: 32rpx;
				.img-url{
					margin-right: 20rpx;
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}
				.chat-text-left{
					margin-right: 118rpx;
					padding: 16rpx 24rpx;
					box-sizing: border-box;
					background: #FFFFFF;
					border-top-right-radius:20rpx;
					border-bottom-right-radius:20rpx;
					border-bottom-left-radius:20rpx;
					font-family: PingFangSC-Regular;
					font-size: 32rpx;
					color: #272832;
					font-weight: 400;
				}
				.img-msg{
					max-width: 284rpx;
					border-radius: 20prx;
				}
				.chat-img-left{
					max-width: 380rpx;
					min-width: 150rpx;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					margin-right: 118rpx;
					padding: 16rpx 24rpx;
					box-sizing: border-box;
					background: #FFFFFF;
					border-top-right-radius:20rpx;
					border-bottom-right-radius:20rpx;
					border-bottom-left-radius:20rpx;
					font-family: PingFangSC-Regular;
					font-size: 32rpx;
					color: #272832;
					font-weight: 400;
					image{
						width: 28rpx;
						height: 36rpx;
					}
				}
				.chat-map-left{
					background-color: #fff;
					width: 464rpx;
					height: 284rpx;
					overflow: hidden;
					border-top-right-radius:20rpx;
					border-bottom-right-radius:20rpx;
					border-bottom-left-radius:20rpx;
					.chat-map-left-name{
						font-size:$uni-font-size-lg;
						color:$uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 1;    
						overflow: hidden; 
					}
					.chat-map-left-address{
						font-size:$uni-font-size-sm;
						color: $uni-text-color-disable;
						padding: 0rpx 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 1;    
						overflow: hidden; 
					}
					.map{
						padding-top: 8rpx;
						width: 464rpx;
						height: 190rpx;
					}
				}
			}
			.chat-right{
				margin-right: 32rpx;
				padding: 20rpx 0;
				display: flex;
				flex-direction: row-reverse;
				.img-url{
					margin-left: 20rpx;
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}
				.chat-text-right{
					margin-left: 118rpx;
					padding: 16rpx 24rpx;
					box-sizing: border-box;
					background: #FFE431;;
					border-top-left-radius:20rpx;
					border-bottom-right-radius:20rpx;
					border-bottom-left-radius:20rpx;
					font-family: PingFangSC-Regular;
					font-size: 32rpx;
					color: #272832;
					font-weight: 400;
				}
				.img-msg{
					max-width: 284rpx;
					border-radius: 20rpx;
				}
				.chat-img-right{
					max-width: 380rpx;
					min-width: 150rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					margin-left: 118rpx;
					padding: 16rpx 24rpx;
					box-sizing: border-box;
					background: #FFE431;
					border-top-left-radius:20rpx;
					border-bottom-right-radius:20rpx;
					border-bottom-left-radius:20rpx;
					font-family: PingFangSC-Regular;
					font-size: 32rpx;
					color: #272832;
					font-weight: 400;
					image{
						transform: rotate(180deg);
						width: 28rpx;
						height: 36rpx;
					}
				}
				.chat-map-right{
					background-color: #fff;
					width: 464rpx;
					height: 284rpx;
					overflow: hidden;
					border-top-left-radius:20rpx;
					border-bottom-right-radius:20rpx;
					border-bottom-left-radius:20rpx;
					.chat-map-right-name{
						font-size:$uni-font-size-lg;
						color:$uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 1;    
						overflow: hidden; 
					}
					.chat-map-right-address{
						font-size:$uni-font-size-sm;
						color: $uni-text-color-disable;
						padding: 0rpx 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 1;    
						overflow: hidden; 
					}
					.map{
						padding-top: 8rpx;
						width: 464rpx;
						height: 190rpx;
					}
				}
			}
		}
	}
	cover-view,
	cover-image {
	    display: inline-block;
	}
</style>
