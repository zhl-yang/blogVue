<template>
  <div class="me-view-body" v-title :data-title="title">
    <el-container class="me-view-container">
      <!--<el-aside class="me-area">-->
      <!--<ul class="me-operation-list">-->
      <!--<li class="me-operation-item">-->
      <!--<el-button type="primary" icon="el-icon-edit"></el-button>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</el-aside>-->
      <el-main>
        <div class="me-view-card">
          <h1 class="me-view-title">{{ article.title }}</h1>
          <div class="me-view-author">
            <a class="">
              <img class="me-view-picture" :src="author.avatar" />
            </a>
            <div class="me-view-info">
              <span>{{ author.nickname }}</span>
              <div class="me-view-meta">
                <span>{{ article.createTime | format }}</span>
                <span>阅读 {{ article.viewNum }}</span>
                <span>评论 {{ comments.length }}</span>
              </div>
            </div>
            <el-button
              v-if="this.author.id == this.$store.state.id"
              @click="editArticle()"
              style="margin-left: 50px;"
              size="mini"
              type="success"
              round
              icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              v-if="this.author.id == this.$store.state.id"
              @click="removeArticle()"
              size="mini"
              type="primary"
              round
              icon="el-icon-delete"
              >删除</el-button
            >
          </div>
          <div class="me-view-content">
            <markdown-editor :editor="editor"></markdown-editor>
          </div>

          <div class="me-view-end">
            <el-alert
              title="文章End..."
              type="success"
              center
              :closable="false"
            >
            </el-alert>
          </div>

          <div class="me-view-tag">
            标签：
            <!--<el-tag v-for="t in tags" :key="t.id" class="me-view-tag-item" size="mini" type="success">{{t.tagname}}</el-tag>-->
            <el-button
              @click="tagOrCategory('tag', t.id)"
              size="mini"
              type="primary"
              v-for="t in tags"
              :key="t.id"
              round
              plain
              >{{ t.tagName }}</el-button
            >
          </div>

          <div class="me-view-tag">
            文章分类：
            <!--<span style="font-weight: 600">{{category.categoryname}}</span>-->
            <el-button
              @click="tagOrCategory('category', category.id)"
              size="mini"
              type="primary"
              round
              plain
              >{{ category.categoryName }}</el-button
            >
          </div>

          <div class="me-view-comment">
            <div class="me-view-comment-write">
              <el-row :gutter="20">
                <el-col :span="2">
                  <a class="">
                    <img class="me-view-picture" :src="avatar" />
                  </a>
                </el-col>
                <el-col :span="21">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    placeholder="你的评论..."
                    class="me-view-comment-text"
                    v-model="comment.content"
                    resize="none"
                  >
                  </el-input>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="3" :offset="21">
                  <el-button
                    type="text"
                    @click="publishComment()"
                    style="margin-top: 5px"
                    >评论</el-button
                  >
                </el-col>
              </el-row>
            </div>

            <div class="me-view-comment-title">
              <span>{{ comments.length }} 条评论</span>
            </div>

            <commment-item
              v-for="(c, index) in comments"
              :comment="c"
              :articleId="article.id"
              :index="index"
              :rootCommentCounts="comments.length"
              @commentCountsIncrement="commentCountsIncrement"
              :key="c.id"
            >
            </commment-item>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import CommmentItem from "@/components/comment/CommentItem";
import { viewArticle, removeArticle } from "@/api/article";
import { getCommentsByArticle, publishComment } from "@/api/comment";
import { getToken } from "@/request/token";
import default_avatar from "@/assets/img/default_avatar.png";
import {Message} from "element-ui";

export default {
  name: "BlogView",
  watch: {
    $route: "getArticle",
  },
  data() {
    return {
      article: {
        id: "",
        title: "",
        commentNum: 0,
        viewNum: 0,
        summary: "",
        createTime: "",
        content: "",
      },
      author: {
        avatar: "",
        id: "",
        nickname: "",
      },
      tags: [],
      category: {},
      editor: {
        value: "",
        toolbarsFlag: false,
        subfield: false,
        defaultOpen: "preview",
      },

      comments: [],
      comment: {
        articleId: "",
        content: "",
      },
    };
  },
  components: {
    "markdown-editor": MarkdownEditor,
    "commment-item": CommmentItem,
  },
  computed: {
    avatar() {
      let avatar = this.$store.state.avatar;
      if (avatar != null && avatar.length > 0) {
        return avatar;
      }
      return default_avatar;
    },
    title() {
      return `${this.article.title} - 文章 - Blog`;
    },
  },
  created() {
    this.getArticle();
  },
  methods: {
    tagOrCategory(type, id) {
      this.$router.push({ path: `/${type}/${id}` });
    },
    editArticle() {
      this.$router.push({ path: `/write/${this.article.id}` });
    },
    removeArticle(){
      var that = this;
      removeArticle(that.$route.params.id)
        .then((data) => {
          Message({
            type: 'success',
            showClose: true,
            message: "文章删除成功",
            duration: 1000,
            onClose:()=>{
              that.loginLoading = false;
              that.$router.push({path: '/'})
            }
          })
        }).catch((error) => {
          if (error !== "error") {
            that.$message({
              type: "error",
              message: "文章删除失败",
              showClose: true,
            });
          }
        });
    },
    getArticle() {
      let that = this;
      viewArticle(that.$route.params.id)
        .then((data) => {
          that.editor.value = data.data.archives.content;
          Object.assign(that.article, data.data.archives);
          Object.assign(that.author, data.data.author);
          Object.assign(that.tags, data.data.tags);
          Object.assign(that.category, data.data.category);
          that.getCommentsByArticle();
        })
        .catch((error) => {
          if (error !== "error") {
            that.$message({
              type: "error",
              message: "文章加载失败",
              showClose: true,
            });
          }
        });
    },
    publishComment() {
      let that = this;
      if (!that.comment.content) {
        return;
      }
      that.$store.state.token = getToken() ? getToken().token : "";
      if (!that.$store.state.token) {
        return that.$message({
          type: "error",
          message: "请登录后再评论",
          showClose: true,
        });
      }
      that.comment.articleId = that.article.id;

      publishComment(that.comment)
        .then((data) => {
          that.$message({
            type: "success",
            message: "评论成功",
            showClose: true,
          });
          that.comments.unshift(data.data);
          that.commentCountsIncrement();
          that.comment.content = "";
        })
        .catch((error) => {
          if (error !== "error") {
            that.$message({
              type: "error",
              message: "评论失败",
              showClose: true,
            });
          }
        });
    },
    getCommentsByArticle() {
      let that = this;
      getCommentsByArticle(that.article.id)
        .then((data) => {
          that.comments = data.data;
        })
        .catch((error) => {
          if (error !== "error") {
            that.$message({
              type: "error",
              message: "评论加载失败",
              showClose: true,
            });
          }
        });
    },
    commentCountsIncrement() {
      this.article.commentCounts += 1;
    },
  },
  //组件内的守卫 调整body的背景色
  beforeRouteEnter(to, from, next) {
    window.document.body.style.backgroundColor = "#fff";
    next();
  },
  beforeRouteLeave(to, from, next) {
    window.document.body.style.backgroundColor = "#f5f5f5";
    next();
  },
};
</script>

<style>
.me-view-body {
  margin: 100px auto 140px;
  width: 100%;
}

.me-view-container {
  width: 70%;
  margin: auto
}

.el-main {
  overflow: hidden;
}

.me-view-title {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.3;
}

.me-view-author {
  margin-top: 30px;
  vertical-align: middle;
  margin-bottom: 30px;
}

.me-view-picture {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  vertical-align: middle;
  background-color: #5fb878;
}

.me-view-info {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
}

.me-view-meta {
  font-size: 12px;
  color: #969696;
}

.me-view-end {
  margin-top: 20px;
  padding-right: 25px;
}

.me-view-tag {
  margin-top: 20px;
  padding-left: 6px;
  border-left: 4px solid #c5cac3;
}

.me-view-tag-item {
  margin: 0 4px;
}

.me-view-comment {
  margin-top: 60px;
}

.me-view-comment-title {
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
}

.me-view-comment-write {
  margin-top: 20px;
}

.me-view-comment-text {
  font-size: 16px;
}

.v-show-content {
  padding: 25px 25px 15px 25px !important;
}

.v-note-wrapper .v-note-panel {
  box-shadow: none !important;
}

.v-note-wrapper .v-note-panel .v-note-show .v-show-content,
.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
  background: #fff !important;
}

.me-view-comment .me-view-comment.div{
  border-radius: 28px 0;
}
</style>
