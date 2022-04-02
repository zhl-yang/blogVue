<template>
  <!-- <div  class="wallpaper" :style="{background:'url('+orignalImg+')no-repeat center/contain'}" > -->
    <div >
        <img class="wallpaper" :src="orignalImg" @click="autoGetWallpaper()">
    </div>
</template>

<script>
  import {getWallpaper } from '@/api/wallpaper.js'
export default {
  data() {
    return {
      orignalImg: "",
      defaultImg : "http://p7.qhimg.com/bdm/1280_1024_85/t015beae3cbec78b570.jpg",
      timer:null
    };
  },
  computed: {
    title() {
      return "壁纸页面";
    },
  },
  methods: {
    autoGetWallpaper(){
        getWallpaper("6").then(data => {
          if(data.data != null ){
            this.orignalImg = data.data.img_1600_900
          }
        }).catch(()=>{
            this.orignalImg = this.defaultImg
        }).finally(() => {
        })
    }
  },
  created() {
    this.autoGetWallpaper();
    this.timer = setInterval(() => {
       setTimeout(this.autoGetWallpaper, 0)
    }, 1000 * 60)
  }
};
</script>

<style scoped>
    .wallpaper{
        width:100%;
        height:100%;
        position:fixed;
        background-size:100% 100%;
    }
    #app {
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>
