<template>
	<view class="content">
		<view class="tap-bar">
			<view class="tap-bar-left" @tap="toIndex()">
				取消
			</view>
			<view class="tap-bar-center">
				创建群聊
			</view>
		</view>
		<view class="center">
			<view class="choose-img">
				<view class="box">
					<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @tap="upload" class="meslist_img"></image>
					<image class='pan' src="../../static/images/group/change(2).png" mode=""></image>
				</view>
			</view>
			<view class="group-name">
				<input class="group-text" type="text" value=""  placeholder="请输入群名称" v-model="group"/>
			</view>
			<view class="title-box">
				<view class="title">
					用户
				</view>
			</view>
		</view>
		<view class="user">
			<view class="user-list">
				<view class="user-box" v-for="(item,index) in user"  @tap='changeSelect(item)'>
					<view class="select" :class='{isSelect:item.isSelect}' @tap='changeSelect(item)'>
						<image src="../../static/images/group/correct.png" mode="" v-if='item.isSelect'></image>
					</view>
					<view class="user-img">
						<image :src="item.img_url" mode=""></image>
					</view>
					<view class="user-name">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="btn" v-if='(number !== 0) && (group.length >= 1)' @tap='buildGroup()'>
				创建（{{number}}）
			</view>
			<view class="grey-btn" v-if='(number==0)||(group.length == 0)'>
				创建（{{number}}）
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import store from '../../store/index.js'
	import config from '../../commons/js/config.js'
	
	export default {
		data() {
			return {
				tempFilePath:'',
				cropFilePath:'../../static/images/group/default.png',
				number:0,
				isN:false,
				group:'',
				uid:store.state.userID,
				gimg_url:'/group/group.png',
				user:[],
				selectedUser:[],
			};
		},
		components: {
		    ImageCropper,
		},
		onLoad() {
			this.selectNumber()
			this.getFriendList()
		},
		methods:{
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
							this.user = res
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
				//待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了
			
				uni.uploadFile({
					url: "/file/upload",
					filePath: this.cropFilePath,
					name: "file",
					fileType: "image",
					formData:{
						url:'group',
						name:this.uid + new Date().getTime(),
					},
					success: (uploadFileRes) => {
					  var backstr = uploadFileRes.data;
					  this.gimg_url = backstr
					  console.log(backstr)
					},
							
					fail(e) {
						console.log("this is errormes " + e.message);
					}
				})
			},
			cancel() {
				console.log("canceled");
				this.tempFilePath = "";
			},
			changeSelect:function(e){
				e.isSelect = !e.isSelect
				this.selectNumber()
			},
			selectNumber:function(){
				if(this.number == 0){
					this.isN = true
				}else{
					this.isN = false
				}
				let j = 0
				for(var i in this.user){
					if(this.user[i].isSelect){
						j++;
					}
				}
				this.number = j;
			},
			toIndex:function(){
				uni.navigateTo({
					url:'../index/index?id='+this.uid
				})
			},
			buildGroup:function(){
				this.selectedUser.push(this.uid)
				if(this.number!==0&&this.group.length>0){
					for(let i in this.user){
						if(this.user[i].isSelect){
							this.selectedUser.push(this.user[i].id)
						}
					}
					uni.request({
						url:'/group/buildgroup',
						data:{
							uid:this.uid,
							name:this.group,
							img_url:this.gimg_url,
							user:this.selectedUser,
						},
						method:'POST',
						success:(data)=>{
							let code = data.data.code;
							if(code == 200){
								uni.showToast({
									icon:'none',
									title:'创建成功',
									duration:1000
								})
								setTimeout(()=>{
									uni.navigateTo({
										url:'../index/index?id='+this.uid
									})
								},1000)
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
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
	}
	.tap-bar{
		position: fixed;
		top: 0rpx;
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
			width: 62rpx;
			height: 44rpx;
			font-family: PingFangSC-Regular;
			font-size: 32rpx;
			color: #272832;
			letter-spacing: -0.55rpx;
			font-weight: 400;
		}
		.tap-bar-center{
			width: 156rpx;
			height: 56rpx;
			font-family: PingFangSC-Regular;
			font-size: 40rpx;
			color: #272832;
			letter-spacing: -0.69rpx;
			font-weight: 400;
		}
	}
	.center{
		top:88rpx;
		background-color: #FFFFFF;
		margin-top:148rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.choose-img{
			margin-bottom: 60rpx;
			width: 196rpx;
			height: 196rpx;
			background: #FFE431;
			box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39,40,50,0.1);
			border-radius: 40rpx;
			.box{
				position: absolute;
			}
			image{
				width: 196rpx;
				height: 196rpx;
			}
			.pan{
				position:absolute;
				left:0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 40rpx;
				height: 40rpx;
			}
		}
		.group-name{
			width: 686rpx;
			height: 92rpx;
			line-height: 92rpx;
			background: #F3F4F6;
			border-radius: 46rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.group-text{
				width: 80%;
				text-align: center;
				line-height: 44rpx;
				font-family: PingFangSC-Regular;
				font-size: 32rpx;
				color: #272832;
				letter-spacing: -0.55rpx;
				font-weight: 400;
			}
		}
		.title-box{
			padding-top: 40rpx;
			width: 100%;
			display: flex;
			justify-content:flex-start;
			.title{
				padding-left: 32rpx;
				height: 60rpx;
				font-family: PingFangSC-Semibold;
				font-size: 44rpx;
				color: #272832;
				letter-spacing: -0.75rpx;
				font-weight: 600;
			}
		}
	}
	.user{
		margin-left: 32rpx;
		margin-right: 32rpx;
		margin-bottom: 100rpx;
		.user-list{
			.user-box{
				padding-top:20rpx;
				padding-bottom: 20rpx;
				display: flex;
				align-items: center;
				.select{
					width: 48rpx;
					height: 48rpx;
					background: rgba(255,228,49,0.50);
					border-radius: 24rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					image{
						width: 30rpx;
						height: 20rpx;
					}
				}
				.isSelect{
					background: #FFE431;
				}
				.user-img{
					padding-left: 32rpx;
					padding-right: 32rpx;
					image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 20rpx;
					}
				}
				.user-name{
					height: 50rpx;
					width: 494rpx;
					font-family: PingFangSC-Regular;
					font-size: 36rpx;
					color: #272832;
					letter-spacing: -0.62rpx;
					font-weight: 400;
					display: -webkit-box;
					-webkit-box-orient: vertical;    
					-webkit-line-clamp: 1;    
					overflow: hidden; 
				}
			}
		}
	}
	.bottom{
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		.btn{
			margin-bottom: env(safe-area-inset-bottom);
			font-family: PingFangSC-Regular;
			font-size: 32rpx;
			color: #272832;
			letter-spacing: -0.55rpx;
			font-weight: 400;
			// padding-bottom:8rpx;
			width: 684rpx;
			height: 80rpx;
			background: #FFE431;
			border-radius: 10rpx;
			text-align: center;
			line-height: 80rpx;
		}
		.grey-btn{
			background:rgba(39,40,50,0.20);
			margin-bottom: env(safe-area-inset-bottom);
			font-family: PingFangSC-Regular;
			font-size: 32rpx;
			color: #272832;
			letter-spacing: -0.55rpx;
			font-weight: 400;
			// padding-bottom:8rpx;
			width: 684rpx;
			height: 80rpx;
			border-radius: 10rpx;
			text-align: center;
			line-height: 80rpx;
		}
	}
</style>
