<template>
	<view class='content'>
		<view class="tap-bar">
			<view class="tap-bar-right" @tap="toSignUp()">
				注册
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/common/logo.png" mode=""></image>
		</view>
		<view class="main">
			<view class="text">
				登录
			</view>
			<view class="greeting">
				您好，欢迎来到yike！
			</view>
			<view class="inputs">
				<input type="text" placeholder="用户名/邮箱" class="user" placeholder-style="color=#bbb;font-weight:400;" v-model="user"/>
				<input type="password" placeholder="密码" class="password" placeholder-style="color=#bbb;font-weight:400" v-model="psw"/>
			</view>
			<view class="tips" v-show='correct'>
				用户名或者密码错误！
			</view>
		</view>
		<view class="submit" @tap="login()">
			登录
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				psw:'',
				user:'',
				correct:false,
			}
		},
		onLoad:function(){
			this.user = store.state.userName
			this.psw = store.state.userPassword
		},
		methods: {
			toSignUp:function(){
				uni.navigateTo({
				    url: '../signup/signup'
				});
			},
			login:function(){
				if(this.user !== ''&&this.psw !== ''){
					uni.request({
						url:'/signin/match',
						data:{
							data:this.user,
							psw:this.psw,
						},
						method:'POST',
						success:(data)=>{
							let code = data.data.code;
							let res = data.data.back;
							if(code == 200){
								store.commit("changeUserID", res.id);
								store.commit("changeUserName", res.name);
								store.commit("changeUserToken", res.token);
								store.commit("changeUserImg", res.img_url);
								uni.showToast({
									icon:'none',
									title:'登录成功',
									duration:2000
								})
								uni.navigateTo({
									url:'../index/index?id='+res.id
								})
							}else if(code == 300){
								this.correct = true
								this.psw = ''
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
			}
		}
	}
</script>

<style lang="scss">
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.tap-bar{
		display: flex;
		align-items: center;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		width: 100%;
		background: $uni-bg-color;
		.tap-bar-right{
			position: absolute;
			right: 56rpx;
		}
	}
	.logo{
		display: flex;
		padding-top: 80rpx;
		padding-bottom: 55rpx;
		justify-content: center;
		align-items: center;
		image{
			height: 92rpx;
			width: 194rpx;
		}
	}
	.main{
		height: 416rpx;
		width: 636rpx;
		padding: 0 56rpx 118rpx;
		.text{
			width: 112rpx;
			height: 80rpx;
			font-size: 56rpx;
			color:$uni-text-color;
			font-weight: 500;
			padding-bottom: 14rpx;
		}
		.greeting{
			width: 408rpx;
			height: 56rpx;
			font-size: 40rpx;
			color: $uni-text-color-grey;
			padding-bottom: 68rpx;
		}
		.inputs{
			.user{
				line-height: 50rpx;
				height: 50rpx;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				font-weight: 500;
				box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.2);
				padding-bottom: 18rpx;
			}
			.password{
				box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.2);
				padding-top: 78rpx;
				padding-bottom: 18rpx;
			}
		}
		.tips{
			padding-top: 10rpx;
			color: $uni-color-warning;
			font-size: $uni-font-size-lg;
		}
	}
	.submit{
		width: 520rpx;
		height: 96rpx;
		background:$uni-color-primary;
		box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
		border-radius: $uni-border-radius-lg;
		font-size: 32rpx;
		line-height: 96rpx;
		text-align: center;
		color: $uni-text-color;
		font-weight: 500;
	}
</style>
