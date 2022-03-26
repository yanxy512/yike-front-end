<template>
	<view class="content">
		<view class="tap-bar">
			<view class="tap-bar-left">
				<image src="../../static/images/userhome/left.png" mode="" @tap='toIndex()'></image>
			</view>
			<view class="tap-bar-center">
				好友请求
			</view>
		</view>
		<view class="main">
			<view class="request-box" v-for = '(item,index) in applyArr' :key = 'index'>
				<view class="top">
					<view class="reject" @tap="reject(item)">
						拒绝
					</view>
					<view class="head">
						<image :src="item.img_url" mode=""></image>
					</view>
					<view class="agree" @tap = 'agree(item)'>
						同意
					</view>
				</view>
				<view class="center">
					<view class="name">
						{{item.name}}
					</view>
					<view class="time">
						{{item.lastTime}}
					</view>
				</view>
				<view class="text">
					<text>留言:</text>
					{{item.news}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfunc from "@/commons/js/myfunc.js"
	import config from '../../commons/js/config.js'
	import store from '../../store/index.js'
	
	export default {
		data() {
			return {
				applyArr:'',
				uid:store.state.userID,
				msg:'',
			};
		},
		onReady:function(){
			this.friendRequest()
		},
		watch:{
			applyArr(){
				if(this.applyArr == 0){
					uni.navigateTo({
						url:'../index/index?id='+this.uid
					})
				}
			},
		},
		methods:{
			//获取好友消息
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
							for(let i in res){
								this.getFriendRequestMsg(res,i)
								res[i].lastTime = myfunc.changeTime(res[i].lastTime)
								res[i].img_url = config.baseURL()+res[i].img_url
							}
							this.applyArr = res
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
			toIndex:function(){
				uni.navigateTo({
					url:'../index/index'
				})
			},
			//获取好友请求消息
			getFriendRequestMsg:function(arr,i){
				uni.request({
					url:'/index/getonemsg',
					data:{
						uid:this.uid,
						fid:arr[i].id,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						let res = data.data.result;
						if(code == 200){
							let e = arr[i]
							e.news = res.message
							arr.splice(i,1,e)
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
			//同意好友请求
			agree:function(item){
				uni.request({
					url:'/friend/agreefriend',
					data:{
						uid:this.uid,
						fid:item.id,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						let res = data.data.result;
						if(code == 200){
							uni.showToast({
								icon:'none',
								title:'添加好友成功',
								duration:2000
							})
							this.applyArr.splice(this.applyArr.indexOf(item),1)
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
			reject:function(item){
				uni.request({
					url:'/friend/deletefriend',
					data:{
						uid:this.uid,
						fid:item.id,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						let res = data.data.result;
						if(code == 200){
							uni.showToast({
								icon:'none',
								title:'删除好友成功',
								duration:2000
							})
							this.applyArr.splice(this.applyArr.indexOf(item),1)
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
			// width: 78rpx;
			height: 56rpx;
			font-family: PingFangSC-Regular;
			font-size: 40rpx;
			color: #272832;
			letter-spacing: -0.69rpx;
			font-weight: 400;
		}
	}
	.main{
		height: 100%;
		padding: 0 32rpx;
		.request-box{
			margin: 132rpx 0 20rpx;
			padding: 20rpx;
			display: flex;
			justify-content: center;
			flex-wrap:wrap;
			background-color: white;
			box-shadow: 0 24rpx 64rpx -8rpx rgba($color: #000000, $alpha: 0.2);
			border-radius: 20rpx;
			.top{
				width: 100%;
				display: flex;
				.reject{
					text-align: center;
					line-height: 64rpx;
					width: 160rpx;
					height: 64rpx;
					border-radius: 40rpx;
					background-color: rgba(255,93,91,0.1);
					font-size: 32rpx;
					color: $uni-color-warning;
				}
				.head{
					margin-top: -104rpx;
					flex:1;
					display: flex;
					justify-content: center;
					align-items: center;
					image{
						width: 144rpx;
						height: 144rpx;
						border-radius: 50%;
					}
				}
				.agree{
					text-align: center;
					line-height: 64rpx;
					width: 160rpx;
					height: 64rpx;
					border-radius: 40rpx;
					background-color: $uni-color-primary;
					font-size: 32rpx;
					color: $uni-text-color;
				}
			}
			.center{
				width: 100%;
				text-align: center;
				padding-top: 20rpx;
				padding-bottom: 40rpx;
				.name{
					font-size: 36rpx;
					font-weight: 500;
					background-color: rgbmax(39,40,50);
					line-height: 50rpx;
				}
				.time{
					font-size: $uni-font-size-sm;
					line-height: 34rpx;
					color:$uni-text-color-disable;
				}
			}
			.text{
				flex:1;
				display: -webkit-box;
				-webkit-box-orient: vertical;    
				-webkit-line-clamp: 2;    
				overflow: hidden; 
				word-break: break-all;
				word-wrap: break-word;
				white-space: normal;
				height: 80rpx;
				padding: 20rpx 32rpx;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-base;
				color:$uni-text-color;
				line-height: 40rpx;
				background-color: $uni-bg-color-grey;
			}
		}
	}
</style>
