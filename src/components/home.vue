<template>
    
    <div class="home_div">
        <el-container class="home_container">
            <el-header>
                <div>
                    <img src="../assets/heima.png">
                    <span>电商管理系统</span>
                </div>
                <el-button type="peimary" @click="login_out">退出</el-button>
            </el-header>
            <el-container>
                <!-- 侧边栏菜单 -->
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <div class="toggle-button" @click="toggleCoiiapse">
                        |||
                    </div>
                    <!-- collapse 折叠  collapse-transition 折叠动画-->
                    <el-menu
                        background-color="#545c64"
                        text-color="#fff" unique-opened router :collapse="isCollapse" :collapse-transition="false"
                        :default-active="active_path"
                        active-text-color="#44abf7">
                        <el-submenu :index="String(item.id)" v-for="item in menuList" :key="item.id">
                            <!-- 一级菜单 -->
                            <template slot="title">
                                <i :class="iconList[item.id]"></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item class="el-menu-item" :index="subItem.path" 
                            v-for="subItem in item.children" :key="subItem.id"
                            @click="set_active(String(subItem.path))"
                            >
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!-- router 占位符 欢迎页面 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
        
    </div>
</template>
<script>
    export default {
        data(){
            return {
                //菜单
                menuList:[],
                //图标
                iconList:{
                    "125":"el-icon-user-solid",
                    "103":"el-icon-s-cooperation",
                    "101":"el-icon-s-goods",
                    "102":"el-icon-s-order",
                    "145":"el-icon-s-data",
                },
                isCollapse:false,
                //菜单高亮值
                active_path:''
            }
        },
        created(){
            this.active_path = window.sessionStorage.getItem('activePath');
            this.getMenuList()
        },
        methods:{
            //退出：将session中的token清空 并且返回登录页
            login_out(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            //获取菜单
            async getMenuList(){
                const {data:res} = await this.$http.get('menus')
                if(res.meta.status !== 200){
                    this.$message.error(res.meta.msg)
                }else{
                    this.menuList = res.data
                }
            },
            //菜单折叠
            toggleCoiiapse(){
                this.isCollapse = !this.isCollapse;
            },
            //菜单高亮
            set_active(valpath){
                window.sessionStorage.setItem('activePath',valpath);
                this.active_path = valpath;
            }
        }
    }
</script>
<style lang="less" scoped>
    .el-aside {
        background-color: #545C64;
        color: #333;
        text-align: center;
        line-height: 200px;
        .el-menu{
            border-right: none;
        }
    }
    .el-header{
        background-color: #545C64;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
    .home_div,.home_container{
        height: 100%;
    }
    .el-menu-item{
        padding-right: 0px;
    }
    .el-header{
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        > div{
            display: flex;
            span {
                margin-left: 10px;
            }
        }
    }
    .toggle-button{
        background-color: #4a5064;
        height: 40px;
        font-size: 10px;
        color: #fff;
        line-height: 40px;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
    .el-submenu .el-menu-item{
        padding-right: 0px;
    }
</style>