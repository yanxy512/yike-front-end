<template>
	<view class='content'>
		<view class="tap-bar">
			<view class="tap-bar-right" @tap="toSignIn()">
				<image src="../../static/images/sign/left.png" mode=""></image>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/common/logo.png" mode=""></image>
		</view>
		<view class="main">
			<view class="text">
				注册
			</view>
			<view class="inputs">
				<view class="inputBox">
					<input type="text" placeholder="请取个名字" class="txt" placeholder-style="color:#bbb;font-weight:400;" v-model="userValue" @blur="checkUser()"/>
					<view class="repeat" v-if="userNameR">
						用户名已有
					</view>
					<image src="../../static/images/sign/right.png" mode="" v-if="isUser"></image>
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入邮箱" class="txt" placeholder-style="color:#bbb;font-weight:400" v-model="emailValue" @blur="checkEmail()"/>
					<view class="repeat" v-if="emailE">
						邮箱格式错误
					</view>
					<image src="../../static/images/sign/right.png" mode="" v-if="isEmail"></image>
				</view>
				<view class="inputBox">
					<input type="text" placeholder="这里输入密码" v-if="look" class="password" placeholder-style="color:#bbb;font-weight:400" v-model='pswValue' @input="checkPsw()"/>
					<input type="password" placeholder="这里输入密码" v-if="!look" class="password" placeholder-style="color:#bbb;font-weight:400" v-model='pswValue'@input="checkPsw()"/>
					<image :src="imgUrl" mode="" @tap="changeEye()"></image>
				</view>	
			</view>
		</view>
		<view :class="[{submit:isOk},{submit1:!isOk}]" @tap="signUp">
			注册
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				isUser:false,
				isEmail:false,
				userNameR:false,
				emailE:false,
				look:false,
				imgUrl:'../../static/images/sign/closeeye.png',
				type:'password',
				emailValue:'',
				userValue:'',
				pswValue:'',
				isOk:false,
			}
		},
		methods: {
			changeEye:function(){
				if(this.look){
					this.look = !this.look;
					this.imgUrl = '../../static/images/sign/closeeye.png'
					this.type = 'password'
				}else{
					this.look = !this.look;
					this.imgUrl = '../../static/images/sign/look.png'
					this.type = 'text'
				}
			},
			toSignIn:function(){
				uni.navigateTo({
					url:'../signin/signin'
				})
			},
			checkUser:function(){
				if(this.userValue!==''){
					uni.request({
						url:'/signup/judge',
						data:{
							data:this.userValue,
							type:'name'
						},
						method:'POST',
						success:(data)=>{
							let code = data.data.code;
							let result = data.data.result
							if(code == 200){
								if(result ==0){
									this.isUser = true;
									this.userNameR = false
								}else{
									this.isUser = false;
									this.userNameR = true;
								}
							}else{
								uni.showToast({
									icon:'none',
									title:'服务器错误',
									duration:2000
								})
								this.isUser = false;
								this.userNameR = true
							}
							console.log(data)
						}
					})
				}
			},
			checkEmail:function(){
				if(this.emailValue!==''){
					var reg = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
					if(reg.test(this.emailValue)){
						uni.request({
							url:'/signup/judge',
							data:{
								data:this.emailValue,
								type:'email'
							},
							method:'POST',
							success:(data)=>{
							let code = data.data.code;
							let result = data.data.result								
							if(code == 200){
									if(result ==0){
										this.emailE = false;
										this.isEmail = true;
									}else{
										this.emailE = true;
										this.isEmail = false
									}
								}else{
									uni.showToast({
										icon:'none',
										title:'服务器错误',
										duration:2000
									})
									this.emailE = true;
									this.isEmail = false;
								}
								console.log(data)
							}
						})
					}else{
						this.emailE = true;
						this.isEmail = false;
					}
				}
			},
			checkPsw:function(){
				if(this.isEmail == true &&this.pswValue.length>5&&this.isUser == true){
					this.isOk=true;
				}else{
					this.isOk=false;
				}
			},
			signUp:function(){
				if(this.isOk == true){
					uni.request({
						url:'/signup/add',
						data:{
							name: this.userValue,
							email: this.emailValue,
							psw: this.pswValue,
						},
						method:'POST',
						success:(data)=>{
							console.log(data)
							let code = data.data.code;
							if(code == 200){
								store.commit("changeUserName", this.userValue);
								store.commit("changeUserPassword", this.pswValue);
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
			left: 24rpx;
		}
		image{
			height: 48rpx;
			width: 48rpx;
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
		width: 636rpx;
		padding: 0 56rpx 0;
		.text{
			width: 112rpx;
			height: 80rpx;
			font-size: 56rpx;
			color:$uni-text-color;
			font-weight: 500;
			padding-bottom: 14rpx;
		}
		.inputs{
			.inputBox{
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,1);
				image{
					width: 42rpx;
					height: 32rpx;
					padding-bottom: 18rpx;
				}
			}
			.repeat{
				line-height: 50rpx;
				height: 50rpx;
				font-size: $uni-font-size-lg;
				color: $uni-color-warning;
				padding-bottom: 18rpx;
				padding-top: 78rpx;
			}
			.txt{
				flex:1;
				line-height: 50rpx;
				height: 50rpx;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				padding-bottom: 18rpx;
				padding-top: 78rpx;
			}
			.password{
				flex:1;
				line-height: 50rpx;
				height: 50rpx;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				padding-top: 78rpx;
				padding-bottom: 18rpx;
				// box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,1);
			}
		}
	}
	.submit{
		margin-top: 118rpx;
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
	.submit1{
		margin-top: 118rpx;
		width: 520rpx;
		height: 96rpx;
		background:rgba(39,40,50,0.20);
		box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
		border-radius: $uni-border-radius-lg;
		font-size: 32rpx;
		line-height: 96rpx;
		text-align: center;
		color: $uni-text-color-inverse;
		font-weight: 500;
	}
</style>
