<template>
	<view>
		<view class="" @tap="upload()">
			上传图片
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'yike'
			};
		},
		onLoad:function(){
			this.test()
		},
		methods:{
			upload:function(){
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: '/file/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								name:new Date().getTime()+this.id,
								url:'user',
							},
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
							}
						});
					}
				});
			},
			test:function(){
				uni.request({
					url:'',
					data:{
					},
					method:'POST',
					success:(data)=>{
						let code = data.data.code;
						if(code == 200){
							
						}else if(code == 300){
							
						}else if(code == 400){
						}else{
							
						}
					},
				})
			}
		},
	}
</script>

<style lang="scss">

</style>
