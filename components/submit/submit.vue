<template>
	<view>
		<view class="submit">
			<view class="submit-top">
				<view class="submit-btn" @tap='isVoice()'>
					<image src="../../static/images/submit/voice(1).png" mode="" v-if='isV'></image>
					<image src="../../static/images/submit/keyboard.png" mode="" v-if='!isV'></image>
				</view>
				<textarea value="" placeholder="" auto-height="true" class='text' v-if='!isV' @input="inputs" v-model='msg' @focus="emojiClose()"/>
				<view class="voice-btn" v-if='isV' @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
					按住说话
				</view>
				<view class="submit-btn" @tap="isEmoji()">
					<image src="../../static/images/submit/emoji.png" mode=""></image>
				</view>
				<view class="submit-btn" @tap="isMore()">
					<image src="../../static/images/submit/add.png" mode=""></image>
				</view>
			</view>
			<view class="emoji" v-if='isE'>
				<view class="emoji-send">
					<view class="emoji-send-det" @tap='emojiDelete()'>
						<image src="../../static/images/submit/back.png" mode=""></image>
					</view>
					<view class="emoji-send-bt" @tap='emojiSend()'>
						发送
					</view>
				</view>
				<emoji @emotion='emotion'></emoji>				
			</view>
			<view class="more" v-if='isM'>
				<view class="more-list"  @tap='sendImg("album")'>
					<image src="../../static/images/submit/photo.png" mode=""></image>
					<view class="more-list-title">
						图片
					</view>
				</view>
				<view class="more-list" @tap='sendImg("camera")'>
					<image src="../../static/images/submit/camera.png" mode="" ></image>
					<view class="more-list-title">
						照相
					</view>
				</view>
				<view class="more-list" @tap="chooseLocation()">
					<image src="../../static/images/submit/location.png" mode=""></image>
					<view class="more-list-title">
						定位
					</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/submit/video.png" mode=""></image>
					<view class="more-list-title">
						视频
					</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/submit/file.png" mode=""></image>
					<view class="more-list-title">
						文件
					</view>
				</view>
			</view>
		</view>
		<view class="cancel" v-if='isC'>
			<view class="cancel-box">
				<view class="cancel-time" :style="{width:120+time*8+'rpx'}">
					{{time}}
				</view>
			</view>
			<view class="cancel-text">
				上滑取消录音
			</view>
		</view>
	</view>
</template>

<script>
	import emoji from './emoji/emoji.vue'
	
	const recorderManager = uni.getRecorderManager();
	export default {
		name:"submit",
		data() {
			return {
				isV:false,
				isE:false,
				isM:false,
				isC:false,
				msg:'',
				time:'',
				clock:'',
				pageY:'',
			};
		},
		components:{
			emoji,
		},
		mounted() {
			this.isVoice()
		},
		methods:{
			isVoice:function(){
				this.isV = !this.isV
				this.isM = false
				this.isE = false
				setTimeout(()=>{
					this.getElementHeight();
				},10)
			},
			isEmoji:function(){
				this.isE = !this.isE
				this.isV = false
				this.isM = false
				setTimeout(()=>{
					this.getElementHeight();
				},10)
			},
			isMore:function(){
				this.isM = !this.isM;
				this.isV = false
				this.isE = false
				setTimeout(()=>{
					this.getElementHeight();
				},10)
			},
			inputs:function(e){
				let chat = e.detail.value
				let pos = chat.indexOf('\n')
				if(pos!==-1&&this.msg.length>1){
					this.send(this.msg,0)		
				}
			},
			getElementHeight:function(){
				const query = uni.createSelectorQuery().in(this)
				query.select('.submit').boundingClientRect((data)=>{
					this.$emit('sumbitHeight',data.height)
				}).exec()
			},
			emotion:function(e){
				this.msg = this.msg+e
			},
			emojiDelete:function(){
				if(this.msg.length>0){
					this.msg = this.msg.substring(0,this.msg.length-1)	
				}
			},
			emojiSend:function(){
				if(this.msg.length>1){
					this.send(this.msg,0)	
				}
			},
			emojiClose:function(){
				this.isE = false;
				setTimeout(()=>{
					this.getElementHeight();
				},10)
			},
			send:function(msgs,type){
				let data = {
					message:msgs,
					types:type,
				}
				this.$emit('inputs',data)
				this.msg = ''		
			},
			sendImg:function(e){
				let count = 9
				if(e !=='album'){
					count:1;
				}
				uni.chooseImage({
				    count: count, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [e], //从相册选择
				    success: (res)=> {
						let filepath = res.tempFilePaths;
						for(let i in filepath){
							this.send(filepath[i],1)
						}
				    }
				});
			},
			touchstart:function(e){
				this.pageY = e.changedTouches[0].pageY
				this.isC = true;
				this.time = 0;
				this.clock=setInterval(()=>{
					this.time++;
				},1000)
				if(this.time>60){
					this.touchend()
				}
				// this.old = new Date().valueOf()
				recorderManager.start();
			},
			touchend:function(){
				clearInterval(this.clock)
				recorderManager.stop();
				recorderManager.onStop((res)=> {
					let data ={
						voice:res.tempFilePath,
						time:this.time,
					}
					if( this.isC == true){
						if(this.time >= 1){
							this.send(data,2)
						}
					}
					this.isC = false;
				});
			},
			touchmove:function(e){
				if(this.pageY - e.changedTouches[0].pageY > 100){
					this.isC = false;
				}
			},
			chooseLocation:function(){
				uni.chooseLocation({
					success: (res)=> {
						let data = {
							name:res.name,
							address:res.address,
							latitude:res.latitude,
							longitude:res.longitude,
						}
						this.send(JSON.stringify(data),3)
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					},
				})
			}
		}
	}
</script>

<style lang="scss">
	.submit{
		z-index:1002;
		position: fixed;
		bottom: 0rpx;
		left: 0;
		width: 100%;
		background: #F4F4F4;
		box-shadow: inset 0px 0.5rpx 0px 0px rgba(0,0,0,0.1);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.submit-top{
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		width: 100%;
		padding:14rpx 10rpx;
		image{
			height: 56rpx;
			width: 56rpx;
			margin:0 10rpx;
			flex:auto;
		}
		.text{
			line-height: 44rpx;
			flex:auto;
			background-color: #fff;
			padding: 20rpx;
			border-radius: 10rpx;
			max-height: 160rpx;
			margin: 0 10rpx;
			font-size: 32rpx;
		}
		.voice-btn{
			line-height: 44rpx;
			font-size: 32rpx;
			color:$uni-text-color-grey;
			text-align: center;
			flex:auto;
			background-color: #fff;
			padding: 20rpx;
			border-radius: 10rpx;
			max-height: 160rpx;
			margin: 0 10rpx;
		}
	}
	.emoji{
		height: 460rpx;
		width: 100%;
		background-color: rgba(236,237,238,1);
		box-shadow: inset 0px 0.5rpx 0px 0px rgba(0,0,0,0.1);
		.emoji-send{
			bottom:env(safe-area-inset-bottom) ;
			width: 300rpx;
			height: 104rpx;
			padding-top: 24rpx;
			background-color: rgba(236,237,238,0.9);
			position: fixed;
			bottom: 0;
			right: 0;
			display: flex;
			.emoji-send-bt{
				flex:1;
				margin: 0 32rpx 0 20rpx;
				height:88rpx ;
				background:rgba(255,228,49,1);
				font-size: 32rpx;
				text-align: center;
				line-height: 88rpx;
				border-radius: 12rpx;
			}
			.emoji-send-det{
				flex:1;
				margin-left: 24rpx;
				height:88rpx ;
				background:#fff;
				font-size: 32rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					height: 48rpx;
					width: 52rpx;
				}
			}
		}
	}
	.more{
		height: 460rpx;
		width: 100%;
		background-color: #F3F4F6;;
		box-shadow: inset 0px 0.5rpx 0px 0px rgba(0,0,0,0.1);
		bottom:env(safe-area-inset-bottom);
		padding: 8rpx 20rpx;
		box-sizing: border-box;
		.more-list{
			width: 25%;
			text-align: center;
			float: left;
			padding-top: 32rpx;
			image{
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background:rgba(255,255,255,1);
				border-radius: 24rpx;
			}
			.more-list-title{
				font-size:24rpx;
				color:rgba(39,40,50,0.5);
				line-height:34rpx;
			}
		}
	}
	.cancel{
		height: 100%;
		width: 100%;
		z-index:1001;
		position: fixed;
		top: 0;
		left:0;
		background-color: rgba(0,0,0,0.3);
		.cancel-box{
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left:0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255,255,255,0.3);
			border-radius: 42rpx;
			text-align: center;
		}
		.cancel-time{
			display: inline-block;
			min-width: 120rpx;
			line-height: 84rpx;
			border-radius: 42rpx;
			background-color: $uni-color-primary;
		}
		.cancel-text{
			position: absolute;
			width: 100%;
			bottom: 148rpx;
			margin-bottom:env(safe-area-inset-bottom) ;
			text-align: center;
			color:#fff;
			font-size:$uni-font-size-base;
		}
	}
</style>
