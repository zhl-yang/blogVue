<template>
  <scroll-page :loading="loading" :offset="offset" :no-data="noData" v-on:load="load">
    <leave-comment-item v-for="a in leaveComments" :key="a.id" v-bind="a"></leave-comment-item>
  </scroll-page>
  
</template>

<script>
  import {getLeaveCommentsByArticle} from "@/api/leaveComment";
  import LeaveCommentItem from '@/components/leave/LeaveCommentItem'
  import ScrollPage from '@/components/scrollpage'

  export default {
    name: "LeaveCommentsScrollPage",
    props: {
      offset: {
        type: Number,
        default: 100
      },
      page: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      'page': {
        handler() {
          this.noData = false
          this.leaveComments = []
          this.innerPage = this.page
          this.getLeaveCommentsByArticle()
        },
        deep: true
      }
    },
    data() {
      return {
        loading: false,
        noData: false,
        innerPage: {
          pageSize: 10,
          pageNo: 1
        },
        leaveComments: []
      }
    },
    components: {
      'leave-comment-item': LeaveCommentItem,
      'scroll-page': ScrollPage
    },
    methods: {
      load() {
        this.getLeaveCommentsByArticle()
      },
      getLeaveCommentsByArticle() {
        let that = this
        that.loading = true
        getLeaveCommentsByArticle(that.innerPage).then(data => {
          let newLeaveComments = data.data.records
          debugger
          if (newLeaveComments && newLeaveComments.length > 0) {
            that.innerPage.pageNo += 1
            that.leaveComments = that.leaveComments.concat(newLeaveComments)
          } else {
            that.noData = true
          }

        }).catch(error => {
          if (error !== 'error') {
            that.$message({type: 'error', message: '留言加载失败!', showClose: true})
          }
        }).finally(() => {
          that.loading = false
        })

      }
    },
    created() {
      this.getLeaveCommentsByArticle()
    }
  }
</script>

<style scoped>
  .el-card {
    border-radius: 0;
  }

  .el-card:not(:first-child) {
    margin-top: 10px;

  }
</style>
