<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 添加按钮 -->
            <el-row :gutter="20">
                <el-col style="text-align: left;">
                    <el-button type="primary" size="small" @click="adddialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table  :data="rolestableData" border stripe style="width: 100%">
                <el-table-column  type="expand">
                    <template slot-scope="scope">
                        <el-row class="vcenter" v-for="(item , index) in scope.row.children" :key="item.id" :class="['bdbottom',index === 0?'bdtop':'']">
                            <!-- 一级标签 -->
                            <el-col :span="5">
                                <el-tag closable @close="closeThreeTag(scope.row,item.id)">{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级三级标签 -->
                            <el-col :span="19">
                                <el-row class="vcenter" v-for="(item2 , i2) in item.children" :key="item2.id" :class="[i2 === 0?'':'bdtop']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="closeThreeTag(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable @close="closeThreeTag(scope.row,item3.id)" type="warning" v-for="(item3 , i2) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column  type="index" label="#"></el-table-column>
                <el-table-column  prop="roleName"  label="角色名称"></el-table-column>
                <el-table-column  prop="roleDesc"  label="角色描述"></el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="getEditInfo(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deluserInfo(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="getSetRight(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色信息 -->
        <el-dialog
        title="添加角色"
        :visible.sync="adddialogVisible"
        width="50%" @close="closeAddInfo">
        <el-form :model="addUserInfo" :rules="userRules" ref="addInforef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addUserInfo.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addUserInfo.roleDesc"></el-input>
              </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="adddialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改信息 -->
        <el-dialog
        title="修改角色"
        :visible.sync="editdialogVisible"
        width="50%" @close="closeEditInfo">
        <el-form :model="editUserInfo" :rules="edituserRules" ref="editInforef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editUserInfo.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editUserInfo.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 分配权限 -->
        <el-dialog
        title="分配权限"
        :visible.sync="setRightdialogVisible"
        width="50%">
        <el-tree :data="rightsList" :props="defaultProps" node-key="id" ref="treeRef" :default-checked-keys="defkeys" show-checkbox default-expand-all></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="subroles">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                //列表
                rolestableData:[],
                //添加角色信息
                addUserInfo:{
                    roleName:'',
                    roleDesc:'',
                },
                //添加用户显示
                adddialogVisible:false,
                //修改用户显示
                editdialogVisible:false,
                //添加角色验证
                userRules:{
                    roleName:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                    roleDesc:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                },
                //修改用户验证
                edituserRules:{
                    roleName:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                    roleDesc:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                },
                //修改用户列表
                editUserInfo:{},
                //分配权限显示隐藏
                setRightdialogVisible:false,
                //所有权限的数据
                rightsList:[],
                //树形控件的属性绑定
                defaultProps:{
                    label:'authName',
                    children:'children'
                },
                //默认选中节点的id数组
                defkeys:[],
                //当前即将分配权限的角色id
                roleId:''
            }
        },
        created(){
            //获取列表
            this.getRolesList();
        },
        methods:{
            async getRolesList(){
                const {data:res} = await this.$http.get('roles');
                if(res.meta.status !== 200){
                    return this.$message.error('获取失败');
                }
                this.rolestableData = res.data;
            },
            //添加用户
            addUser(){
                this.$refs.addInforef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.post('roles',this.addUserInfo)
                    if(res.meta.status !== 201){
                        return this.$message.error('添加失败')
                    }
                    this.$message.success('添加成功')
                    this.adddialogVisible = false;
                    this.getRolesList()
                })
            },
            //添加对话框关闭事件
            closeAddInfo(){
                this.$refs.addInforef.resetFields()
            },
            //监听修改对话框关闭
            closeEditInfo(){
                this.$refs.editInforef.resetFields()
            },
            //获取修改信息
            async getEditInfo(id){
                this.editdialogVisible = true;
                const {data:res} = await this.$http.get('roles/'+id);
                if(res.meta.status !== 200 ){
                    return this.$message.error('获取信息失败')
                }
                this.editUserInfo = res.data;
                this.$message.success('获取用户信息成功')  
            },
            //删除
            async deluserInfo(id){
                const confirmRes = await this.$confirm('删除角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=> err)
                //如果用户确认返回值为字符串confirm 取消cancel
                if(confirmRes !== 'confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data:res} = await this.$http.delete('roles/'+id)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success('删除成功');
                this.getRolesList()
            },
            //提交修改信息
            editUser(){
                this.$refs.editInforef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.put('roles/'+this.editUserInfo.roleId,{
                        roleName:this.editUserInfo.roleName,
                        roleDesc:this.editUserInfo.roleDesc,
                    })
                    if(res.meta.status !== 200){
                        return this.$message.error('修改失败')
                    }
                    this.$message.success('用户修改成功')
                    this.editdialogVisible = false;
                    this.getRolesList()
                })
            },
            //删除三级权限
            async closeThreeTag(row,id3){
                const confirmRes = await this.$confirm('删除角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=> err)
                //如果用户确认返回值为字符串confirm 取消cancel
                if(confirmRes !== 'confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data:res} = await this.$http.delete(`roles/${row.id}/rights/${id3}`)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success('删除成功');
                row.children = res.data;
            },
            //分配权限
            async getSetRight(row){
                const {data:res} = await this.$http.get('rights/tree')
                if(res.meta.status !== 200){
                    return this.$message.error('获取失败');
                }
                this.rightsList = res.data;
                this.roleId = row.id;
                //获取三级节点id
                this.defkeys=[];
                this.getLeafkeys(row,this.defkeys);
                this.setRightdialogVisible = true;
            },
            //通过递归获取角色下所有三级权限的ID并保存到defkeys中
            getLeafkeys(node,arr){
                //如果当前节点不包含children 则是三级节点
                if(!node.children){
                    return arr.push(node.id);
                }
                node.children.forEach(item => {
                    this.getLeafkeys(item,arr);
                });
            },
            //点击提交分配权限
            async subroles(){
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys(),
                ]
                const idStr = keys.join(',');
                const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
                if(res.meta.status !== 200 ){
                    return this.$message.error('分配权限失败')
                }
                this.$message.success('分配权限成功')
                this.getRolesList();
                this.setRightdialogVisible = false;
            }
            
        }   
    }
</script>
<style>
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
        margin-left: 20px;
    }
    .el-tag{
        margin: 10px;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>