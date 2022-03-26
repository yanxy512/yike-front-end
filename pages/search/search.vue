<template>
	<view class='content'>
		<view class="tap-bar">
			<view class="search-div">
				<input type="search" value="" class='search' placeholder="搜索用户/群" v-model="searchResult" @input="searchR()"/>
				<image src='../../static/images/search/search.png' mode=""></image>
			</view>
			<view class="tap-bar-right" @tap="toIndex()">
				取消
			</view>
		</view>
		<view class="main">
			<view class="result">
				<view class="title" v-if='this.searchResult !== ""'>
					用户
				</view>
				<view class="search-list" v-for="(item,index) in userArr" :key = 'index'>
					<image :src="item.img_url" mode="" @tap="toUserhome(item._id)"></image>
					<view class="names" @tap="toUserhome(item._id)">
						<view class="name" v-html='item.name'>
						</view>
						<view class="email" v-html='item.email'>
						</view>
					</view>
					<view class="send" v-if='item.ship == 1'>
						发消息
					</view>
					<view class="add" v-if='item.ship == 0'  @tap="addFriend(item._id)">
						加好友
					</view>
				</view>
			</view>
		</view>
		<view class="modify" :animation="animationData">
			<view class="modify-tap-bar">
				<view class="modify-tap-bar-left" @tap="showModify()" >
					取消
				</view>
				<view class="modify-tap-bar-center">
					发送消息
				</view>
				<view class="modify-tap-bar-right" @tap='check()'>
					确定
				</view>
			</view>
			<view class="modify-text">
				<textarea value='' placeholder="" class="change-text" v-model="old"/>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfun from '../../commons/js/myfunc.js'
	import store from '@/store/index.js';
	import config from '../../commons/js/config.js'
	
	export default {
		data() {
			return {
				fid:'',
				userName:store.state.userName,
				searchResult:'',
				userArr:'',
				uID:store.state.userID,
				animationData: {},
				isModify:false,
				old:store.state.userName+",请求添加好友",
			};
		},
		methods:{
			addFriend:function(e){
				this.fid = e
				this.showModify()
			},
			check:function(){
				this.showModify()
				if(this.old.length>0){
					uni.request({
						url:'/friend/applyfriend',
						data:{
							uid:this.uID,
							fid:this.fid,
							msg:this.old,
						},
						method:'POST',
						success:(data)=>{
							let code = data.data.code;
							if(code == 200){
								uni.showToast({
									icon:'none',
									title:'好友申请发送成功',
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
							}else{
								uni.showToast({
									icon:'none',
									title:'服务器错误',
									duration:2000
								})
							}
						}
					})
				}
			},
			showModify:function(text,old,isPsw){
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
			},
			searchR:
				myfun.debounce(function(){
					uni.request({
						url:'/search/searchuser',
						data:{
							data:this.searchResult,
						},
						method:'POST',
						success:(data)=>{
							let code = data.data.code;
							if(code == 200){
								this.userArr = [];
								if(this.searchResult!==''){
									let friendArr = data.data.result;
									for(let i in friendArr){
										if(friendArr[i]._id !== this.uID)
										this.isFriend(friendArr[i])
									}
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
							}else{
								uni.showToast({
									icon:'none',
									title:'服务器错误',
									duration:2000
								})
							}
						}
					})
				},500),
			isFriend:function(e){
				let ship = 0;
				let reg = eval('/'+this.searchResult+'/g');
				uni.request({
					url:'/search/isfriend',
					data:{
						uID:this.uID,
						fID:e._id,
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						if(code == 200){
							// console.log(e)
							ship = 1
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
							ship = 0
						}else{
							uni.showToast({
								icon:'none',
								title:'服务器错误',
								duration:2000
							})
						}
						e.ship = ship;
						e.img_url = config.baseURL()+ e.img_url;
						e.name = e.name.replace(reg,"<span style='color: #54AFFF'>"+this.searchResult+"</span>")
						e.email = e.email.replace(reg,"<span style='color: #54AFFF'>"+this.searchResult+"</span>")
						this.userArr.push(e);
					}
				})
			},
			toIndex:function(){
				uni.navigateTo({
				    url:'../index/index'
				});
			},
			toUserhome:function(e){
				uni.navigateTo({
				    url:'../userhome/userhome?id='+e
				});
			}
		}
	}
</script>

<style lang="scss">
	.tap-bar{
		z-index:1000;
		position: fixed;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
		width: 100%;
		background: $uni-bg-color;
		.search-div{
			height: 60rpx;
			background: $uni-bg-color-grey;
			border-radius: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-left: 32rpx;
			.search{
				padding-left:20rpx;
				box-sizing: border-box;
				width: 548rpx;
				height: 60rpx;
				background: #F3F4F6;
				border-radius: 10rpx;
			}
			image{
				width: 40rpx;
				height: 40rpx;
				margin-right: 12rpx;
			}
		}
		.tap-bar-right{
			position: absolute;
			right: $uni-spacing-col-base;
			width: 56rpx;
			height: 40rpx;
			font-size: 28rpx;
			color: #272832;
			letter-spacing: -0.48rpx;
			image{
				width: 52rpx;
				height: 52rpx;
			}
		}
	}
	.main{
		padding:122rpx 32rpx 0;
		.result{
			.title{
				width: 86rpx;
				height: 60rpx;
				font-size: 44rpx;
				color: #272832;
				font-weight: 600;
				letter-spacing: -0.75rpx;
			}
			.search-list{
				display:flex;
				justify-content: center;
				align-items: center;
				image{
					margin: 20rpx 32rpx 20rpx 0;
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}
				.names{
					flex:1;
					.name{
						width: 140rpx;
						height: 50rpx;
						font-family: PingFangSC-Regular;
						font-size: 36rpx;
						color: #272832;
						letter-spacing: -0.62rpx;
						line-height: 50rpx;
						font-weight: 400;
					}
					.email{
						font-size: 28rpx;
					}
				}
				.send{
					width: 120rpx;
					height: 48rpx;
					background: #FFE431;
					border-radius: 24rpx;
					font-family: PingFangSC-Regular;
					font-size: 24rpx;
					color: #272832;
					letter-spacing: -0.41rpx;
					font-weight: 800;
					text-align: center;
					line-height: 48rpx;
				}
				.add{
					width: 120rpx;
					height: 48rpx;
					background: rgba(74,170,255,0.10);
					border-radius: 24rpx;
					font-family: PingFangSC-Regular;
					font-size: 24rpx;
					color: #4AAAFF;
					letter-spacing: -0.41rpx;
					font-weight: 800;
					text-align: center;
					line-height: 48rpx;
				}
			}
		}
	}
	.modify{
		z-index: 1002;
		height: 100%;
		width: 100%;
		background-color: white;
		position: fixed;
		bottom: -2000px;
		.modify-tap-bar{
			z-index:1003;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			width: 100%;
			background: $uni-bg-color;
			box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
			.modify-tap-bar-left{
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
			.modify-tap-bar-center{
				font-family: PingFangSC-Regular;
				font-size: 40rpx;
				color: #272832;
				letter-spacing: -0.69rpx;
				font-weight: 400;
			}
			.modify-tap-bar-right{
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
