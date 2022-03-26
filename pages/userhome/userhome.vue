<template>
	<view class="content">
		<view class="tap-bar">
			<view class="tap-bar-left">
				<image src="../../static/images/userhome/left.png" mode="" @tap='backOne()'></image>
			</view>
			<view class="tap-bar-right" v-if='relation == 0|| relation == 1' @tap='toUserDetails()'>
				<image src="../../static/images/userhome/more.png" mode=""></image>
			</view>
		</view>
		<view class="bg" >
			<view class="bg-white" :animation="animationData3"></view>
			<image :src="user.img" mode="aspectFill" ></image>
		</view>
		<view class="main">
			<view class="user-img-box">
				<view class="img-box">
					<image :src="user.img" mode="" class="user-img" :animation="animationData1"></image>
					<view class="sex" :style="{background:sexc}" :animation="animationData2">
						<image :src="sex_img" mode=""></image>
					</view>
				</view>
			</view>
			<view class="name-box">
				<view class="name">
					{{user.name}}
				</view>
			</view>
			<view class="nick-box">
				<view class="nick">
					昵称：{{user.nick}}
				</view>
			</view>
			<view class="news-box">
				{{user.news}}
			</view>
		</view>
		<view class="btn" @tap="showAdd()" v-if='relation == 2'>
			加为好友
		</view>
		<view class="btn" v-if='relation == 1'>
			发送消息
		</view>
		<view class="add-msg" :animation="animationData" :style="{height:addHeight+'px',bottom:-+addHeight+'px'}">
			<view class="add-name">
				{{user.nick}}
			</view>
			<textarea value="" placeholder="" maxlength="120" class='add-text'v-model='apply'/>
		</view>
		<view class="add-btn" :animation="animationData">
			<view class="cancel" @tap = 'showAdd()'>
				取消
			</view>
			<view class="send" @tap='addFriend()'>
				发送
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import config from '../../commons/js/config.js'
	export default {
		data() {
			return {
				id:'',
				uid:store.state.userID,
				isAdd:false,
				addHeight:'',
				myname:store.state.userName,
				sexc:' ',
				sex_img:'',
				relation:'',
				apply:store.state.userName+"  请求添加好友",
				user:{
					name:'',
					nick:'',
					news:'',
					img:''
				},
				animationData: {},
				animationData1: {},
				animationData2: {},
				animationData3: {},
			};
		},
		onLoad:function(e){
			this.id = e.id
			this.getUserInfo()
			this.getRelation()
		},
		onReady:function(){
			this.getElement()
		},
		methods:{
			addFriend:function(){
				this.showAdd()
				if(this.apply.length>0){
					uni.request({
						url:'/friend/applyfriend',
						data:{
							uid:this.uID,
							fid:this.id,
							msg:this.apply,
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
			//到首页
			backOne:function(){
				uni.navigateBack({
					delta:1
				})
			},
			//获取用户个人信息
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
							this.user.name = res.name
							this.user.img = config.baseURL() + res.img_url
							this.getsex(res.sex)
							if(!this.user.news){
								this.user.news = '这个人很懒，什么都没有留下~'
							}else{
								this.user.news = res.news
							}
							if(!res.nickname){
								this.user.nick = res.name
							}else{
								this.user.nick = res.nickname
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
			//判断关系
			getRelation:function(){
				if(this.id == this.uid){
					this.relation = 0
				}else{
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
								this.relation = 1
								this.getNick()
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
								this.relation = 2
							}else{
								uni.showToast({
									icon:'none',
									title:'服务器错误',
									duration:2000
								})
							}
						},
					})
				}
			},
			//获取好友昵称
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
			//判断用户性别
			getsex:function(e){
				if(e == 'female'){
					this.sexc = '#FF5D5B'
					this.sex_img = '../../static/images/userhome/female.png'
				}else if(e == 'male'){
					this.sexc = '#54AFFF'
					this.sex_img = '../../static/images/userhome/male.png'
				}else{
					this.sexc = '#272832'
					this.sex_img = '../../static/images/userhome/sex.png'
				}
			},
			showAdd:function(){
				this.isAdd = !this.isAdd;
				var animation = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
				var animation1 = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
				var animation2 = uni.createAnimation({
				    duration: 100,
				    timingFunction: 'ease',
				})
				var animation3 = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
				if(this.isAdd){
					animation.bottom(0).step()
					animation1.width(120).height(120).top(15).step()
					animation2.opacity(0).step()
					animation3.backgroundColor('rgba(255,228,49,1)').step()
				}else{
					animation.bottom(-this.addHeight).step()
					animation1.width(200).height(200).left(0).top(0).step()
					animation2.opacity(1).step()
					animation3.backgroundColor('rgba(255,255,255,0)').step()
				}
				this.animationData = animation.export()
				this.animationData1 = animation1.export()
				this.animationData2 = animation2.export()
				this.animationData3 = animation3.export()
			},
			getElement:function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
				  this.addHeight = data.height-186;
				}).exec();
			},
			toUserDetails:function(){
				uni.navigateTo({
					url:'../userdetails/userdetails?id='+this.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
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
		.tap-bar-left{
			position: absolute;
			left:24rpx;
			image{
				width: 48rpx;
				height: 48rpx;
			}
		}
		.tap-bar-right{
			position: absolute;
			right: $uni-spacing-col-base;
			image{
				width: 52rpx;
				height: 12rpx;
			}
		}
	}
	.bg{
		z-index: -1;
		height: 100%;
		width: 100%;
		position: fixed;
		left: 0;
		top:0;
		display: flex;
		justify-content: center;
		align-items: center;
		.bg-white{
			width: 100%;
			height: 100%;
			background-color:white;
		}
		image{
			opacity: 0.4;
			position: absolute;
			height: 110%;
			width: 110%;
			filter: blur(18rpx);
		}
	}
	.main{
		padding-top:148rpx;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-wrap:wrap;
		.user-img-box{
			z-index: 10;
			position: relative;
			width: 100%;
			height: 400rpx;
			display: flex;
			justify-content: center;
			padding: 60rpx 0 48rpx;
			.user-img{
				width: 400rpx;
				height: 400rpx;
				border: 6rpx solid #FFFFFF;
				border-radius: 48rpx;
				box-shadow: 0rpx 36rpx 40rpx 0px rgba(39,40,50,0.1);
			}
			.sex{
				position: absolute;
				bottom: 61rpx;
				right: 190rpx;
				width: 64rpx;
				height: 64rpx;
				border-radius: 56rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
		.name-box{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			.name{
				text-align: center;
				width: 252rpx;
				height: 74rpx;
				line-height: 74rpx;
				font-family: PingFangSC-Regular;
				font-size: 52rpx;
				color: #272832;
				letter-spacing: -0.89rpx;
				font-weight: 400;
			}
		}
		.nick-box{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: centerr;
			.nick{
				height: 40rpx;
				line-height: 40rpx;
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				color: #272832;
				letter-spacing: -0.48rpx;
				font-weight: 400;
			}
		}
		.news-box{
			padding-top: 20rpx;
			width: 552rpx;
			height: 170rpx;
			font-family: PingFangSC-Light;
			font-size: 28rpx;
			color: #272832;
			letter-spacing: -0.48rpx;
			line-height: 48rpx;
			font-weight: 200;
		}
	}
	.btn{
		margin-bottom: env(safe-area-inset-bottom);
		font-family: PingFangSC-Regular;
		font-size: 32rpx;
		color: #272832;
		letter-spacing: -0.55rpx;
		font-weight: 400;
		position: fixed;
		bottom:8rpx;
		width: 684rpx;
		height: 80rpx;
		background: #FFE431;
		border-radius: 10rpx;
		text-align: center;
		line-height: 80rpx;
	}
	.add-msg{
		position: fixed;
		width: 100%;
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		.add-name{
			padding-left: 60rpx;
			padding-top:168rpx;
			padding-bottom: 40rpx;
			width: 252rpx;
			height: 74rpx;
			font-family: PingFangSC-Regular;
			font-size: 52rpx;
			color: #272832;
			letter-spacing: -0.89rpx;
			font-weight: 400;
		}
		.add-text{
			margin: 0rpx 56rpx 0;
			padding: 18rpx 0 0 22rpx;
			line-height: 44rpx;
			font-family: PingFangSC-Regular;
			font-size: 32rpx;
			color: #272832;
			letter-spacing: -0.55rpx;
			font-weight: 400;
			height: 360rpx;
			background: #F3F4F6;
			border-radius: 20rpx;
		}
	}
	.add-btn{
		position: fixed;
		padding-bottom: 8rpx;
		margin-bottom: env(safe-area-inset-bottom);
		bottom:-200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.send{
			margin-right: 32rpx;
			width: 480rpx;
			height: 80rpx;
			background: #FFE431;
			border-radius: 10rpx;
			line-height: 80rpx;
			text-align: center;
			font-family: PingFangSC-Regular;
			font-size: 32rpx;
			color: #272832;
			letter-spacing: -0.55rpx;
			font-weight: 400;
		}
		.cancel{
			margin-left: 34rpx;
			margin-right: 32rpx;
			width: 172rpx;
			height: 80rpx;
			background: rgba(39,40,50,0.10);
			border-radius: 10rpx;
			line-height: 80rpx;
			text-align: center;
			font-family: PingFangSC-Regular;
			font-size: 32rpx;
			color: #272832;
			letter-spacing: -0.55rpx;
			font-weight: 400;
		}
	}
</style>
