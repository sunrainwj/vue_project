<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 权限列表 -->
        <el-table  :data="rightstableData" border stripe style="width: 100%">
            <el-table-column  type="index" label="#"></el-table-column>
            <el-table-column  prop="authName"  label="权限名称"></el-table-column>
            <el-table-column  prop="path"  label="路径"></el-table-column>
            <el-table-column  prop="level"  label="权限等级">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level == 0">一级</el-tag>
                    <el-tag v-else-if='scope.row.level == 1' type="success">二级</el-tag>
                    <el-tag v-else type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                //列表
                rightstableData:[]
            }
        },
        created(){
            //获取列表
            this.getAuthList();
        },
        methods:{
            async getAuthList(){
                const {data:res} = await this.$http.get('rights/list');
                if(res.meta.status !== 200){
                    return this.$message.error('获取失败');
                }
                this.rightstableData = res.data;
            }
        }
    }
</script>
<style>

</style>