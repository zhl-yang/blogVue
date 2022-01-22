<template>
  <el-card>
    <h1 class="me-author-name">松花烧饼</h1>
    <div class="me-author-description">
      <span>且随疾风前行,身后亦需留心</span>
    </div>
    <div class="me-author-tool">
      <i @click="showTool(qq)" :title="qq.title" class="me-icon-QQ"></i>
      <i @click="showTool(gitee)" :title="gitee.title" class="me-icon-github"></i>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: 'CardMe',
    data() {
      return {
        qq: {title: 'QQ', message: '959489273'},
        gitee: {
          title: 'github',
          message: '<a target="_blank" href="https://github.com/zhl-yang/msgWechat">https://github.com/zhl-yang/msgWechat</a>'
        }
      }
    },
    methods: {
      showTool(tool) {
        this.$message({
          duration: 0,
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: '<strong>' + tool.message + '</strong>'
        });
      }
    }
  }
</script>

<style scoped>
  .me-author-name {
    text-align: center;
    font-size: 30px;
    border-bottom: 1px solid #5FB878;
  }

  .me-author-description {
    padding: 8px 0;
  }

  .me-icon-job {
    padding-left: 16px;
  }

  .me-author-tool {
    text-align: center;
    padding-top: 10px;
  }

  .me-author-tool i {
    cursor: pointer;
    padding: 4px 10px;
    font-size: 30px;
  }
</style>
