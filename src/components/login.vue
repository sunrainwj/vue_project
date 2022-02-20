<template>
  <div class="login_container">
    <div class="login_box">
      <el-form :rules="loginFormRules" ref="loginFormRef" :model="login_form" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="login_form.username" prefix-icon="iconfont el-icon-user" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="login_form.password" type="password" prefix-icon="iconfont el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submit">登录</el-button>
          <el-button type="info" size="small" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      login_form: {
        username:'',
        password:''
      },
      loginFormRules:{
        username:[
          { required: true, message: '此项必填', trigger: 'blur' }
        ],
        password:[
        { required: true, message: '此项必填', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    //重置
    reset(){
      this.$refs.loginFormRef.resetFields();
    },
    submit(){
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        //post地址 参数 解构赋值
        const {data:result} = await this.$http.post("login",this.login_form);
        if(result.meta.status !== 200){
          this.$message.error('登录失败');
        }else{
          this.$message({
            message: '登陆成功',
            type: 'success'
          });
        };
        console.log(result);
        //获取token保存到session
        window.sessionStorage.setItem('loginToken',result.data.token);
        this.$router.push('/home');
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .login_container{
    background-color: #46A3FF;
    height:100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: aliceblue;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .login_form{
    position: absolute;
    bottom: 20px;
    left: 120px;
    text-align: center;
  }
</style>