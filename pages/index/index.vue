<template>
	<view class="content">
		<view class="tap-bar">
			<view class="tap-bar-left" @tap="toUserhome(uid)">
				<image :src="img_url" mode=""></image>
			</view>
			<view class="tap-bar-center">
				<image src="../../static/images/common/logo.png" mode=""></image>
			</view>
			<view class="tap-bar-right">
				<image class="search" src="../../static/images/index/search.png" mode="" @tap='toSearch()'></image>
				<image src="../../static/images/index/add.png" mode="" @tap = 'toBuildGroup()'></image>
			</view>
		</view>
		<view class="main">
			<view class="none" v-if= 'isNone'>
				<view class="none-img">
					<image src="../../static/images/index/apply.png" mode="aspectFit"></image>
				</view>
				<view class="none-text">
					你还没有一个好友~
				</view>
				<view class="none-btn" @tap = 'toSearch()'>
					<view class="none-btn-text">
						添加好友
					</view>
				</view>
			</view>
			<view class="friends" @tap="toFriendRequest()" v-if='friendRequestNumner > 0 '>
				<view class="friends-list">
					<view class="friends-list-left">
						<view class="tip" >
							{{friendRequestNumner}}
						</view>
						<image src="../../static/images/index/apply.png" mode=""></image>
					</view>
					<view class="friends-list-right">
						<view class="top">
							<view class="name">
								好友请求
							</view>
							<view class="time">
								{{friendRequestLastTime}}
							</view>
						</view>
						<view class="news">
							好友申请
						</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friends-list" v-for="(item,index) in friendArr" :key = "index" >
					<view class="friends-list-left" @tap="toUserhome(item.id)">
						<view class="tip" v-if="item.tip>0">
							{{item.tip}}
						</view>
						<image :src="item.img_url" mode=""></image>
					</view>
					<view class="friends-list-right" @tap='toChatRoom(item)'>
						<view class="top">
							<view class="name">
								{{item.name}}
							</view>
							<view class="time">
								{{changeTime(item.lastTime)}}
							</view>
						</view>
						<view class="news">
							{{item.news}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import datas from '../../commons/js/datas.js'
	import myfunc from '../../commons/js/myfunc.js'
	import config from '../../commons/js/config.js'
	
	export default{
		data(){
			return {
				group:[],
				friendArr:[],
				user:'',
				uid:'',
				img_url:'',
				friendRequestNumner:'',
				friendRequestLastTime:'',
				isNone:false,
				socketid:'',
			}
		},
		onLoad(){
			this.user = store.state.userName
			this.uid = store.state.userID
			this.img_url = config.baseURL() + store.state.userImg
			this.friendRequest()
			this.getFriendList()
			this.getGroupList()
			this.join(this.uid)
			this.receiveSocketMsg()
			this.receiveSocketGroupMsg()
		},
		onPullDownRefresh() {
			this.user = store.state.userName
			this.uid = store.state.userID
			this.img_url = config.baseURL() + store.state.userImg
			this.friendArr = []
			this.friendRequest()
			this.getFriendList()
			this.getGroupList()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		watch:{
			friendArr(){
				if(this.friendArr.length !== 0||this.friendRequestNumner!==0){
					this.isNone = false
				}
				if(this.friendArr.length == 0 && this.friendRequestNumner === 0){
					this.isNone = true
				}
			}
		},
		methods:{
			//注册socket
			join:function(uid){
				this.socket.emit('join',uid)
			},
			//socket聊天数据接收
			receiveSocketMsg:function(msg){
				this.socket.on(msg,(msg,fromid)=>{
					let nmsg = ''
					if(msg.types==0){
						nmsg = msg.message
					}else if(msg.types ==1){
						nmsg = '[图片]'
					}else if(msg.types ==2){
						nmsg = '[语音]'
					}else if(msg.types ==3){
						nmsg = '[地图]'
					}
					for(let i in this.friendArr){
						if(this.friendArr[i].id == fromid){
							let e = this.friendArr[i]
							e.lastTime = new Date()
							e.news = nmsg
							e.tip++
							this.friendArr.splice(i,1)
							this.friendArr.unshift(e)
						}
					}
				})
			},
			receiveSocketGroupMsg:function(){
				this.socket.on('groupmsg',(msg,fromid,tip,name,img_url)=>{
					let nmsg = ''
					if(msg.types==0){
						nmsg = msg.message
					}else if(msg.types ==1){
						nmsg = '[图片]'
					}else if(msg.types ==2){
						nmsg = '[语音]'
					}else if(msg.types ==3){
						nmsg = '[地图]'
					}
					for(let i in this.friendArr){
						if(this.friendArr[i].id == fromid){
							let e = this.friendArr[i]
							e.lastTime = new Date()
							e.news = name+':'+nmsg
							e.tip++
							this.friendArr.splice(i,1)
							this.friendArr.unshift(e)
						}
					}
				})
			},
			//请求好友消息获取
			friendRequest:function(){
				uni.request({
					url:'/index/getuser',
					data:{
						uid:this.uid,
						status:1,
						state:1,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						let res = data.data.result;
						if(code == 200){
							this.friendRequestNumner = res.length
							let max = ''
							for(let i in res){
								if(max==''){
									max = res[i].lastTime
								}else{
									if(new Date(Date.parse(max)) < new Date(Date.parse(res[i].lastTime))){
										max = res[i].lastTime
									}
								}
							}
							this.friendRequestLastTime = myfunc.changeTime(max)
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
							
						}else if(code == 500){
							
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
			//获取好友列表
			getFriendList:function(){
				uni.request({
					url:'/index/getuser',
					data:{
						uid:this.uid,
						status:0,
						state:0,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						let res = data.data.result;
						if(code == 200){
							for(let i in res){
								if(res[i].nick !== undefined){
									res[i].name = res[i].nick
								}
								res[i].img_url = config.baseURL()+res[i].img_url
							}
							this.isOk(this.friendArr)
							this.friendArr = res
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
							
						}else if(code == 500){
							
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
			//
			isOk:function(e){
				if(e.length>0){
					this.friendArr = this.friendArr.concat(this.group)
					function compare(property){
					    return function(a,b){
					        var value1 = new Date(a[property]).valueOf();
					        var value2 = new Date(b[property]).valueOf();
					        return value2 - value1;
					    }
					}
					this.friendArr.sort(compare('lastTime'))
				}
			},
			//获得群列表
			getGroupList:function(){
				uni.request({
					url:'/index/getgroup',
					data:{
						uid:this.uid,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						let res = data.data.result;
						if(code == 200){
							if(res.length>0){
								for(let i in res){
									res[i].id = res[i].gid
									res[i].img_url = config.baseURL()+res[i].img_url
									this.socket.emit('group',res[i].id)
								}
								this.group = res
								this.isOk(this.group)
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
							
						}else if(code == 500){
							
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
			changeTime:function(e){
				return myfunc.changeTime(e)
			},
			toSearch:function(){
				uni.navigateTo({
					url:'../search/search?id='+this.uid
				})
			},
			toUserhome:function(e){
				uni.navigateTo({
					url:'../userhome/userhome?id='+e
				})
			},
			toFriendRequest:function(){
				uni.navigateTo({
					url:'../friendrequest/friendrequest?id='+this.uid
				})
			},
			toChatRoom:function(item){
				uni.navigateTo({
					url:'../chatroom/chatroom?id='+item.id+'&img_url='+item.img_url+'&name='+item.name+'&type='+item.type
				})
			},
			toBuildGroup:function(){
				uni.navigateTo({
					url:'../buildgroup/buildgroup?id='+this.uid
				})
			}
		}
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
		position: fixed;
		left: 0;
		top: 0;
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
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
			}
		}
		.tap-bar-center{
			// padding-top:var(--status-bar-height);
			image{ 
				width: 88rpx;
				height: 42rpx;
			}
		}
		.tap-bar-right{
			position: absolute;
			right: $uni-spacing-col-base;
			.search{
				position: absolute;
				right:88rpx;
			}
			image{
				width: 52rpx;
				height: 52rpx;
			}
		}
	}
	.none{
		text-align: center;
		padding-top: 400rpx;
		.none-img{
			image{
				height: 250rpx;
			}
		}
		.none-text{
			padding: 32rpx 0;
			font-size: $uni-font-size-base;
			color:rgba(39,40,50,0.4);
			line-height: 40rpx;
		}
		.none-btn{
			display: inline-block;
			width: 240rpx;
			height: 96rpx;
			background:$uni-color-primary;
			box-shadow: 0rpx 52rpx 36rpx -32rpx rgba(255,228,49,0.4);
			font-size: $uni-font-size-base;
			border-radius: 48rpx;
			color:$uni-text-color;
			line-height: 96rpx;
		}
	}
	.main{
		padding-top: 104rpx;
		.friends-list{
			height: 96rpx;
			padding: 16rpx $uni-spacing-col-base;
			&:active{
				background-color: $uni-bg-color-grey;
			}
			.friends-list-left{
				position: relative;
				float: left;
				.tip{
					position: absolute;
					left:68rpx;
					top:-8rpx;
					z-index:10;
					min-width: 20rpx;
					height: 36rpx;
					padding: 0 8rpx;
					line-height: 36rpx;
					background: $uni-color-warning;
					border-radius: 18rpx;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-inverse;
					text-align: center;
				}
				image{
					width: 96rpx;
					height: 96rpx;
					border-radius: $uni-border-radius-base;
					background-color: $uni-color-primary;
				}
			}
			.friends-list-right{
				padding-left:128rpx;
				.top{
					height: 50rpx;
					.name{
						float: left;
						line-height: 50rpx;
						font-size: 36rpx;
						color: $uni-text-color;
						font-weight: 400;
					}
					.time{
						float: right;
						line-height: 50rpx;
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
					}
				}
				.news{
					line-height: 40rpx;
					width: 558rpx;
					font-size: $uni-font-size-base;
					color: $uni-text-color-grey;   
					display: -webkit-box;    
					-webkit-box-orient: vertical;    
					-webkit-line-clamp: 1;    
					overflow: hidden; 
					word-break: break-all;
					word-wrap: break-word;
					white-space: normal;
				}
			}
		}
	}
</style>
