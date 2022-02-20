<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert
                title="注意：只允许为第三季分类设置相关参数"
                type="warning" :closable="false" style="height: 40px;" show-icon>
            </el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类</span>
                    <el-cascader expand-trigger="hover" :options="cateList" :props="cateOptions" v-model="selectKeys" @change="parenthandleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="clickAddbtn">添加参数</el-button>
                    <el-table :data="manyTableList" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input style="width: 120px;" class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New</el-button>
                              </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="showEditInfo(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="delEditInfo(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="clickAddbtn">添加属性</el-button>
                    <el-table :data="onlyTableList" border stripe style="width: 100%;">
                        <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <!-- 循环渲染Tag标签 -->
                                    <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                    <!-- 输入的文本框 -->
                                    <el-input style="width: 120px;" class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New</el-button>
                                </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="showEditInfo(scope.row.attr_id)" >编辑</el-button>
                                <el-button type="danger" size="mini" @click="delEditInfo(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog
        :title='"添加" + titleText'
        :visible.sync="adddialogVisible"
        @close="closeDialog"
        width="50%">
        <el-form :model="addParamsInfo" :rules="addFormRules" ref="addInforef" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="addParamsInfo.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="adddialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="addParams">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改对话框 -->
        <el-dialog
        :title='"修改" + titleText'
        :visible.sync="editdialogVisible"
        @close="editcloseDialog"
        width="50%">
        <el-form :model="editParamsInfo" :rules="editFormRules" ref="editInforef" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="editParamsInfo.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="editdialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="editParams">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                //商品分类列表
                cateList:[],
                cateOptions:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                selectKeys:[],
                //页签
                activeName:'many',
                //动态参数数据
                manyTableList:[],
                //静态参数数据
                onlyTableList:[],
                adddialogVisible:false,
                //添加参数
                addParamsInfo:{},
                addFormRules:{
                    attr_name:[
                    { required: true, message: '此项必填', trigger: 'blur' }
                    ]
                },
                //修改弹窗显示
                editdialogVisible:false,
                //修改参数
                editParamsInfo:{},
                editFormRules:{
                    attr_name:[
                    { required: true, message: '此项必填', trigger: 'blur' }
                    ]
                },
                //切换tag标签和按钮
                // inputVisible:false,
                // //标签文本框输入
                // inputValue:'',

            }
        },
        created(){
            this.getCateList()
        },
        methods:{
            //获取所有商品分类列表
            async getCateList(){
                const {data:res} = await this.$http.get('categories');
                if(res.meta.status !== 200){
                    return this.$message.error('获取失败');
                }
                this.cateList = res.data;
            },
            //级联选择框选择项触发
            parenthandleChange(){
               this.getParamsData()
            },
            //页签点击事件
            handleClick(){
                this.getParamsData()
            },
            //获取参数列表数据
            async getParamsData(){
                 //选中不是三级分类
                 if(this.selectKeys.length !== 3){
                    this.selectKeys = [];
                    this.manyTableList = [];
                    this.onlyTableList = [];
                    return;
                }
                //根据分类所选id,和当前所属面板获取对应参数
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
                if(res.meta.status !== 200){
                    return this.$message.error('获取失败');
                }
                res.data.forEach(item => {
                    //数组转换
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    //文本框显示隐藏
                    item.inputVisible = false;
                    //文本框输入值
                    item.inputValue = ''
                })
                if(this.activeName === 'many'){
                    this.manyTableList = res.data;
                }else{
                    this.onlyTableList = res.data;
                }
                
            },
            //确认参加
            async addParams(){
                this.$refs.addInforef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name:this.addParamsInfo.attr_name,
                        attr_sel:this.activeName
                    });
                    if(res.meta.status !== 201){
                        return this.$message.error('添加失败');
                    }
                    this.$message.success('添加成功');
                    
                    this.adddialogVisible = false;
                    this.getParamsData()
                })
            },
            //添加参数按钮
            clickAddbtn(){
                this.adddialogVisible = true;
            },
            //表单重置
            closeDialog(){
                this.$refs.addInforef.resetFields();
            },
            //点击按钮展示编辑对话框
            async showEditInfo(val_id){
                    const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${val_id}`,{
                        attr_sel:this.activeName
                    });
                    if(res.meta.status !== 200){
                        return this.$message.error('获取失败');
                    }
                    this.editParamsInfo = res.data;
                    this.editdialogVisible = true;
                
            },
            //确认提交修改参数
            editParams(){  
                this.$refs.editInforef.validate(async valid => {
                    if(!valid) return
                        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsInfo.attr_id}`,{
                        attr_name:this.editParamsInfo.attr_name,
                        attr_sel:this.activeName
                    });
                    if(res.meta.status !== 200){
                        return this.$message.error('修改失败');
                    }
                    this.$message.success('修改成功');
                    
                    this.editdialogVisible = false;
                    this.getParamsData()
                })
            },
            //重置修改表单
            editcloseDialog(){
                this.$refs.editInforef.resetFields();
            },
            //删除
            async delEditInfo(attrId){
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该参数, 是否继续?',
                    '提示',
                    {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }
                ).catch(err => err)
                // 取消了删除
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除！')
                }
                // 删除
                const { data: res } = await this.$http.delete(
                    `categories/${this.cateId}/attributes/${attrId}`
                )

                if (res.meta.status !== 200) {
                    return this.$message.error('删除失败！')
                }

                this.$message.success('删除参数成功！')
                this.getParamsData()
            },
            //文本失去焦点或回车
            async handleInputConfirm(row){
                //去除字符串两端的空格判断是否输入正确内容
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrVals(row)
            },
            //点击按钮显示文本框
            showInput(row){
                console.log(row);
                row.inputVisible = true
                // 让文本框自动获得焦点
                // $nextTick 方法的作用，就是当页面上元素被重新渲染之后调用
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            // 删除对应的参数
            handleClose(i, row) {
                row.attr_vals.splice(i, 1)
                this.saveAttrVals(row)
            },
            // 保存到数据库
            async saveAttrVals(row) {
            // 需要发起请求，保存这次操作
            const { data: res } = await this.$http.put(
                `categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
                }
            )

            if (res.meta.status !== 200) {
                return this.$message.error('修改参数项失败！')
            }

            this.$message.success('修改参数项成功！')
            },
        },
        computed:{
            //按钮需要被禁用返回true
            isBtnDisabled(){
                if(this.selectKeys.length !== 3){
                    return true;
                }
                return false;
            },
            //当前选中的三级分类id
            cateId(){
                if(this.selectKeys.length === 3){
                    return this.selectKeys[2];
                }
                return false;
            },
            //动态弹窗文本
            titleText(){
                if(this.activeName === 'many'){
                    return '动态参数'
                }
                return '静态属性'
            }
        }
    }
</script>
<style>
    .cat_opt{
        text-align: left;
    }
    .el-tabs{
        text-align: left;
    }
</style>