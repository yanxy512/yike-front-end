<template>
	<view class="content">
		<view class="tap-bar">
			<view class="tap-bar-left">
				<image src="../../static/images/userhome/left1.png" mode="" @tap='backOne()'></image>
			</view>
			<view class="tap-bar-right">
				<image src="../../static/images/userhome/more1.png" mode=""></image>
			</view>
		</view>
		<view class="tap-bar change-color" :animation="animationData">
			<view class="tap-bar-left">
				<image src="../../static/images/userhome/left.png" mode="" @tap='backOne()'></image>
			</view>
			<view class="tap-bar-right">
				<image src="../../static/images/userhome/more.png" mode=""></image>
			</view>
		</view>
		<view class="bg">
			<image src="../../static/images/img/8.jpeg" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="main-box">
				<view class="top">
					<view class="top-top">
						<view class="top-name">
							开心就好了
						</view>
						<view class="top-time">
							2019/12/23
						</view>
					</view>
					<view class="top-intr">
						嗡嗡嗡嗡嗡嗡嗡嗡嗡嗡s嗡嗡嗡嗡嗡dadhhhhhhhhhhhhhada嗡嗡嗡嗡嗡嗡哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇我
					</view>
				</view>
				<view class="center">
					<view class="center-top">
						<view class="center-name">
							群成员
						</view>
						<view class="center-top-right">
							<view class="center-memeber">
								成员管理
							</view>
							<view class="memeber-img">
								<image src="../../static/images/chatroom/left.png" mode=""></image>
							</view>
						</view>
					</view>
					<view class="memeber">
						<view class="memeber-box"  v-for='(item,index) in memeberArr' >
							<view class="img-box">
								<image :src='item.img_url' mode=""></image>
								<view class="cancel">
									<image src='../../static/images/group/cancel.png' mode=""></image>
								</view>
							</view>
							<view class="memeber-name">
								{{item.name}}
							</view>
						</view>
						<view class="memeber-box">
							<view class="img-box ">
								<view class="invite">
									<image src='../../static/images/index/add.png'mode=""></image>
								</view>
							</view>
							<view class="memeber-name">
								邀请
							</view>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="user-box">
						<view class="head-box">
							<view class="word">
								群头像
							</view>
							<view class="head">
								<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
								<image :src ="group.img_url" @tap="upload" class="meslist_img"></image>
							</view>
							<view class="more">
								<image src="../../static/images/userdetails/left.png" mode=""></image>
							</view>
						</view>
						<view class="box" @tap="showModify('群名称',group.name)">
							<view class="word">
								群名称
							</view>
							<view class="text">
								{{group.name}}
							</view>
							<view class="more">
								<image src="../../static/images/userdetails/left.png" mode=""></image>
							</view>
						</view>
						<view class="box" @tap="showModify('群公告',group.notice)">
							<view class="word">
								群公告
							</view>
							<view class="text">
								{{group.notice}}
							</view>
							<view class="more">
								<image src="../../static/images/userdetails/left.png" mode=""></image>
							</view>
						</view>
						<view class="box" @tap="showModify('群内名',group.nick)">
							<view class="word">
								群内名
							</view>
							<view class="text">
								{{group.nick}}
							</view>
							<view class="more">
								<image src="../../static/images/userdetails/left.png" mode=""></image>
							</view>
						</view>
						<view class="box">
							<view class="word">
								消息免打扰
							</view>
							<view class="more">
								 <switch :checked='group.disturb' @change="switch1Change" color='#FFE431'/>
							</view>
						</view>
					</view>
				</view>
				<view class="btn">
					退出群聊
				</view>
			</view>
		</view>
		<view class="modify" :animation="animationData">
			<view class="modify-tap-bar">
				<view class="modify-tap-bar-left" @tap="showModify()">
					取消
				</view>
				<view class="modify-tap-bar-center">
					{{centerText}}
				</view>
				<view class="modify-tap-bar-right">
					确定
				</view>
			</view>
			<view class="modify-text">
				<input type="text" value="" class='old-psw'placeholder="请输入原密码" v-if="isOldPsw"/>
				<textarea value="" placeholder="" class="change-text" v-model="old"/>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import datas from '../../commons/js/datas.js'
	export default {
		data() {
			return {
				memeberArr:[],
				animationData: {},
				centerText:'',
				old:'',
				isOldPsw:false,
				isModify:false,
				group:{
					disturb:false,
					name:'开心就好了',
					notice:'开心就好了开心就好了开心就好了开心就好了开心就好了开心就好了',
					nick:'开心就好了',
					img_url:'../../static/images/img/8.jpeg'
				},
				tempFilePath: "",
				top:0,
			};
		},
		components: {
		    ImageCropper,
		},
		onLoad() {
			this.getMemeber();
		},
		onReady(){
			this.getElementHeight()
		},
		onPageScroll : function() { //nvue暂不支持滚动监听，可用bindingx代替
		    this.getElementHeight()
			this.changeColor()
		},
		methods:{
			changeColor:function(){
				var animation = uni.createAnimation({
				      duration: 500,
				        timingFunction: 'linear',
				})
				this.animation = animation
				if(this.top<60){
					animation.opacity(1).step()
				}else{
					animation.opacity(0).step()
				}
				this.animationData = animation.export()
			},
			switch1Change: function (e) {
				this.group.disturb =  e.target.value
			},
			getMemeber:function(){
				let arr = datas.friends();
				for(let i=0;i<9;i++){
					arr[i].img_url = '../../static/images/img/'+ arr[i].img_url;
					this.memeberArr.push(arr[i])
				}
			},
			showModify:function(text,old,isPsw){
				this.centerText = text
				this.old = old
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
				this.group.img_url = e.detail.tempFilePath;
					
				// #ifdef APP-PLUS||MP
				//除了H5端返回base64数据外，其他端都是返回临时地址，所以你要判断base64还是临时文件名，（用条件编译APP-PLUS||MP执行编译。）
				//按我这里是先上传裁剪得来的临时文件地址然后得到临时文件名，
				//待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了
			
				uni.uploadFile({
					url: "后端地址上传图片接口地址",
					filePath: this.cropFilePath,
					name: "file",
					fileType: "image",
					//formData:{},传递参数
					success: (uploadFileRes) => {
					  var backstr = uploadFileRes.data;
					  //自定义操作
					},
			
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});
					
				// #endif
			},
			cancel() {
				console.log("canceled");
				this.tempFilePath = "";
			},
			getElementHeight:function(){
				const query = uni.createSelectorQuery().in(this)
				query.select('.main-box').boundingClientRect((data)=>{
					this.top = data.top;
				}).exec()
			},
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
	.change-color{
		background-color: #FFFFFF;
		opacity: 0;
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
		z-index:-1;
		width: 100%;
		height: 750rpx;
		position: fixed;
		top:0;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.main{
		padding-top:360rpx;
		width: 100%;
		.top{
			padding-left: 32rpx;
			// box-sizing: border-box;
			padding-right: 32rpx;
			padding-bottom: 40rpx;
			background-color: #FFFFFF;
			border-radius: 40rpx 40rpx 0 0;
			box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.5);
			.top-top{
				padding-top: 32rpx;
				padding-bottom: 20rpx;
				display: flex;
				justify-content: space-between;
				.top-name{
					height: 66rpx;
					line-height: 66rpx;
					font-family: PingFangSC-Semibold;
					font-size: 48rpx;
					color: #272832;
					letter-spacing: -0.82rpx;
					font-weight: 600;
				}
				.top-time{
					line-height: 66rpx;
					height: 40rpx;
					font-family: PingFangSC-Regular;
					font-size: 28rpx;
					color: rgba(39,40,50,0.50);
					letter-spacing: -0.48rpx;
					font-weight: 400;
				}
			}
			.top-intr{
				width: 100%;
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #272832;
				// letter-spacing: -0.48rpx;
				font-weight: 400;
				display: -webkit-box;
				-webkit-box-orient: vertical;    
				-webkit-line-clamp: 2;    
				overflow: hidden; 
			}
		}
		.center{
			padding-top: 28rpx;
			background-color: #ffffff;
			box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.3);
			.center-top{
				padding-left: 32rpx;
				padding-right: 32rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.center-name{
					width: 106rpx;
					height: 50rpx;
					font-family: PingFangSC-Semibold;
					font-size: 36rpx;
					color: #272832;
					letter-spacing: -0.62rpx;
					font-weight: 600;
				}
				.center-top-right{
					display: flex;
					align-items: center;
					.center-memeber{
						width: 124rpx;
						height: 44rpx;
						font-family: PingFangSC-Regular;
						font-size: 32rpx;
						color: rgba(39,40,50,0.60);
						letter-spacing: -0.55rpx;
						font-weight: 400;
						padding-right: 32rpx;
					}
					image{
						height: 44rpx;
						width: 44rpx;
						transform: rotate(-180deg);
					}
				}
			}
			.memeber{
				// box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.5);
				padding-bottom: 28rpx;
				display: flex;
				padding-left: 10rpx;
				padding-right: 10rpx;
				justify-content: center;
				flex-wrap: wrap;
				background-color: #FFFFFF;
				.memeber-box{
					width: 20%;
					.img-box{
						position: relative;
						padding-left: 22rpx;
						padding-right: 22rpx;
						padding-top: 20rpx;
						padding-bottom: 8rpx;
						width: 104rpx;
						height: 104rpx;
						border-radius: 20rpx;
						.invite{
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: yellow;
							border-radius:20rpx ;
						}
						image{
							width: 104rpx;
							height: 104rpx;
							border-radius: 20rpx;
						}
						.cancel{
							position:absolute;
							right:0rpx;
							top:0rpx;
							width: 40rpx;
							height: 40rpx;
							background: #FF5D5B;
							border-radius: 50%;
							display: flex;
							justify-content: center;
							align-items: center;
							image{
								width: 20rpx;
								height: 20rpx;
							}
						}
					}
					.memeber-name{
						text-align: center;
						height: 40rpx;
						font-family: PingFangSC-Regular;
						font-size: 28rpx;
						color: #272832;
						letter-spacing: -0.48rpx;
						font-weight: 400;
						display: -webkit-box;
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 1;    
						overflow: hidden; 
						margin-bottom: 12rpx;
					}
				}
			}
		}
	}
	.btn{
		background-color: #FFFFFF;
		padding-top: 40rpx;
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
	.user-box{
		background-color: #FFFFFF;
		box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.5);
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction:column ;
		.head-box{
			margin-top: 22rpx;
			height: 112rpx;
			width: 100%;
			display: flex;
			align-items: center;
			.word{
				padding: 0 32rpx 0 32rpx;
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
					width: 80rpx;
					height: 80rpx;
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
			height: 112rpx;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.word{
				padding: 0 32rpx 0 32rpx;
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
</style>
