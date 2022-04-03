<template>
  <!-- <div  class="wallpaper" :style="{background:'url('+orignalImg+')no-repeat center/contain'}" > -->
  <div>
    <img
      class="wallpaper"
      :src="orignalImg"
      @click="autoGetWallpaper()"
      @dblclick="openSelect()"
    />

    <template>
      <div class="bobo" v-show="showPrise">
        <el-form ref="form" :model="form" label-width="100px">
          <div class="title">修改壁纸生成规则</div>

          <el-form-item label="选择壁纸类型">
            <el-select v-model="form.tagId" placeholder="请选择">
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择壁纸尺寸">
            <el-select v-model="form.imgType" placeholder="请选择">
              <el-option
                v-for="item in imgTypes"
                :key="item.code"
                :label="item.des"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="刷新间隔(秒)">
            <el-input-number
              v-model="form.time"
              :step="1"
              step-strictly
            ></el-input-number>
          </el-form-item>
          <el-button type="primary" @click="onSubmit">立即修改</el-button>
          <el-button @click="onClose">取消</el-button>
        </el-form>
      </div>
    </template>
  </div>
</template>

<script>
import { getWallpaper, getTags } from "@/api/wallpaper.js";

export default {
  data() {
    return {
      showPrise: false,
      orignalImg: "",
      defaultImg:
        "http://p7.qhimg.com/bdm/1280_1024_85/t015beae3cbec78b570.jpg",
      timer: null,
      clickTimer: null,
      popupVisible1: true,
      form: {
        tagId: 0,
        imgType: "img1600900",
        time: 60,
      },
      tags: [
        {
          id: 0,
          name: "其他分类",
        },
      ],
      imgTypes: [
        {
          code: "img1024768",
          des: "1024 * 768",
        },
        {
          code: "img1280800",
          des: "1280 * 800",
        },
        {
          code: "img1366768",
          des: "1366 * 768",
        },
        {
          code: "img1440900",
          des: "1440 * 900",
        },
        {
          code: "img1600900",
          des: "1600 * 900",
        },
        {
          code: "img12801024",
          des: "1280 * 1024",
        },
      ],
    };
  },
  computed: {
    title() {
      return "壁纸页面";
    },
  },
  methods: {
    autoGetWallpaper() {
      clearTimeout(this.clickTimer); //首先清除计时器
      this.clickTimer = setTimeout(() => {
        //这里执行你自己的方法或者业务逻辑
        var tagIds = this.form.tagId;
        getWallpaper(tagIds)
          .then((data) => {
            if (data.data != null) {
              var imgType = this.form.imgType;
              if (imgType != null) {
                this.orignalImg = data.data[imgType];
              } else {
                this.orignalImg = data.data.img1600900;
              }
              if(tagIds != data.data.classId){
                Message({
                  type: 'warning',
                  showClose: true,
                  message: '当前标签无壁纸，系统已自动为您分配新的标签',
                  duration: 1000
                })
                this.form.tagId = data.data.classId
              }
            }
          })
          .catch(() => {
            this.orignalImg = this.defaultImg;
          })
          .finally(() => {});
      }, 300);
    },
    openSelect() {
      clearTimeout(this.clickTimer); //首先清除计时器
      this.showPrise = true;
      clearInterval(this.timer);
    },
    onSubmit() {
      this.autoGetWallpaper();
      this.createdTime(this.form.time);
      this.showPrise = false;
    },
    onClose() {
      this.showPrise = false;
    },
    createdTime(time) {
      if (time < 0 || time == null) {
        time = 1000 * 60 * 60;
      }
      this.timer = setInterval(() => {
        setTimeout(this.autoGetWallpaper, 0);
      }, time * 1000);
    },

    getTagList() {
      getTags().then((data) => {
        if (data.data != null) {
          this.tags = data.data;
        }
      });
    },
  },

  created() {
    this.autoGetWallpaper();
    this.getTagList();
  },
};
</script>

<style scoped>
.wallpaper {
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
.el-form {
  text-align: center;
  background: rgb(244 244 245 / 50%);
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  width: 361px;
  height: 300px;
  padding: 7%;
  float: left;
  position: relative;
  right: 50%;
  margin-top: 20%;
}
.bobo {
  float: left;
  position: relative;
  left: 50%;
}
.submit {
  text-align: center;
}
.title {
  margin-bottom: 32px;
  font-size: 2em;
  color: #606266;
  margin-top: -10px;
}
</style>
