<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 添加按钮 -->
            <el-row :gutter="20">
                <el-col style="text-align: left;">
                    <el-button type="primary" size="small" @click="showAddCatedialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table :data="cateList" :columns="columns"
             :selection-type="false"
             :expand-type="false" show-index index-text="#" border
             >
             <!-- 通过slote绑定模板 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" size="mini">编辑</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 4, 5]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <!-- 添加对话框 -->
            <el-dialog
            title="添加分类"
            :visible.sync="adddialogVisible"
            width="50%"
            @close="closedialogVisible">
            <el-form :model="addCaterInfo" :rules="userRules" ref="addInforef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="addCaterInfo.cat_name"></el-input>
                </el-form-item>
            
                <el-form-item label="父级分类">
                    <el-cascader style="width: 100%;" clearable change-on-select
                    v-model="selectKeys"
                    :options="parentList"
                    :props="parentOptions"
                    expand-trigger="hover"
                    @change="parenthandleChange"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adddialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                //查询条件
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                //商品分类列表
                cateList:[],
                total:0,
                //table指定列定义
                columns:[
                    {
                        label:'分类名称',
                        prop:'cat_name'
                    },
                    {
                        label:'是否有效',
                        //定义模板列
                        type:'template',
                        //这一列使用模板的名称
                        template:'isok'
                    },
                    {
                        label:'排序',
                        //定义模板列
                        type:'template',
                        //这一列使用模板的名称
                        template:'order'
                    },
                    {
                        label:'操作',
                        //定义模板列
                        type:'template',
                        //这一列使用模板的名称
                        template:'opt'
                    }
                ],
                adddialogVisible:false,
                //添加信息
                addCaterInfo:{
                    cat_name:'',
                    cat_pid:0,
                    cat_level:0,
                },
                userRules:{
                    cat_name:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ]
                },
                //父级分类列表
                parentList:[],
                parentOptions:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                selectKeys:[]
            }
        },
        created(){
            this.getcateList()
        },
        methods:{
            //获取分类列表
            async getcateList(){
                const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
                if(res.meta.status !== 200){
                    return this.$message.error('获取失败');
                }
                console.log(res)
                this.cateList = res.data.result;
                this.total = res.data.total;
            },
            //改变每页显示数量pagesize
            handleSizeChange(newsize){
                this.queryInfo.pagesize = newsize;
                this.getcateList()
            },
            //点击页
            handleCurrentChange(newnum){
                this.queryInfo.pagenum = newnum;
                this.getcateList()
            },
            //添加分类
            addCate(){
                this.$refs.addInforef.validate(async valid => {
                    if(!valid) return
                    // const {data:res} = await this.$http.post('users',this.addUserInfo)
                    // if(res.meta.status !== 201){
                    //     return this.$message.error('添加失败')
                    // }
                    // this.$message.success('用户添加成功')
                    this.adddialogVisible = false;
                    this.getcateList()
                })
            },
            //显示添加框
            showAddCatedialog(){
                this.getParentList();
                this.adddialogVisible =true;
            },
            //获取腹肌分类列表
            async getParentList(){
                const {data:res} = await this.$http.get('categories',{params:{type:2}});
                if(res.meta.status !== 200){
                    return this.$message.error('获取失败');
                }
                this.parentList = res.data;
            },
            parenthandleChange(){
                if(this.selectKeys.length>0){
                    this.addCaterInfo.cat_pid = this.selectKeys[
                    this.selectKeys.length-1
                    ]
                    this.addCaterInfo.cat_level = this.selectKeys.length
                    return
                }else{
                    this.addCaterInfo.cat_pid = 0;
                    this.addCaterInfo.cat_level = 0

                }
            },
            //添加分类
            async addCate(){
                this.$refs.addInforef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.post('categories',this.addCaterInfo)
                    if(res.meta.status !== 201){
                        return this.$message.error('添加失败')
                    }
                    this.$message.success('用户添加成功')
                    this.adddialogVisible = false;
                    this.getcateList()
                })
            },
            //关闭弹窗重置表单
            closedialogVisible(){
                this.$refs.addInforef.resetFields();
                this.selectKeys = [];
                this.addCaterInfo.cat_pid = 0;
                this.addCaterInfo.cat_level = 0
            }
        }
    }
</script>
<style>

</style>