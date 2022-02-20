<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 搜索栏 -->
            <el-row :gutter="20">
                <el-col :span="17">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
                        <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="7">
                    <el-button type="primary" @click="adddialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表 -->
            <el-table  :data="tableData" border stripe style="width: 100%">
                <el-table-column  type="index" label="#"></el-table-column>
                <el-table-column  prop="username"  label="姓名"></el-table-column>
                <el-table-column  prop="email"  label="邮箱"></el-table-column>
                <el-table-column  prop="mobile"  label="电话"></el-table-column>
                <el-table-column  prop="role_name"  label="角色"></el-table-column>
                <el-table-column  label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="getEditInfo(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deluserInfo(scope.row.id)"></el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoleInfo(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
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
            <!-- 添加用户信息 -->
            <el-dialog
            title="添加用户"
            :visible.sync="adddialogVisible"
            width="50%" @close="closeAddInfo">
            <el-form :model="addUserInfo" :rules="userRules" ref="addInforef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="addUserInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserInfo.password"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserInfo.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addUserInfo.mobile"></el-input>
                  </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adddialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
            </el-dialog>
            <!-- 修改用户信息 -->
            <el-dialog
            title="修改用户"
            :visible.sync="editdialogVisible"
            width="50%" @close="closeEditInfo">
            <el-form :model="editUserInfo" :rules="edituserRules" ref="editInforef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editUserInfo.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                <el-input v-model="editUserInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                <el-input v-model="editUserInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
            </el-dialog>
            <!-- 分配角色对话框 -->
            <el-dialog
            title="分配角色"
            :visible.sync="setRoledialogVisible"
            @close="closeSetRoledialog"
            width="50%">
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的角色：{{userInfo.role_name}}</p>
                <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                      v-for="item in rolesList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id">
                    </el-option>
                  </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoledialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                tableData:[],
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5
                },
                total:0,
                //添加用户显示
                adddialogVisible:false,
                //修改用户显示
                editdialogVisible:false,
                //添加用户信息
                addUserInfo:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                //添加用户验证
                userRules:{
                    username:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                    password:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                    email:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                    mobile:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                },
                //修改用户验证
                edituserRules:{
                    username:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                    password:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                    email:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                    mobile:[
                    { required: true, message: '此项必填', trigger: 'blur' },
                    ],
                },
                //修改用户列表
                editUserInfo:{},
                //分配角色对话框显示隐藏
                setRoledialogVisible:false,
                //分配角色显示数据
                userInfo:{},
                //角色列表
                rolesList:[],
                //已选中角色id
                selectedRoleId:'',
            }
        },
        created(){
            this.getUsersList()
        },
        methods:{
            //获取列表
            async getUsersList(){
                const {data:res} = await this.$http.get('users',{params:this.queryInfo});
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.tableData = res.data.users;
                this.total = res.data.total;
            },
            //改变每页显示数量pagesize
            handleSizeChange(newsize){
                this.queryInfo.pagesize = newsize;
                this.getUsersList()
            },
            //点击页
            handleCurrentChange(newnum){
                this.queryInfo.pagenum = newnum;
                this.getUsersList()
            },
            //更新用户状态
            async userStateChange(row){
                const {data:res} = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
                if(res.meta.status !== 200){
                    row.mg_state = !row.mg_state
                    return this.$message.error('更新状态失败')
                }
                this.$message.success('更新成功')
            },
            //添加对话框关闭事件
            closeAddInfo(){
                this.$refs.addInforef.resetFields()
            },
            //添加用户
            addUser(){
                this.$refs.addInforef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.post('users',this.addUserInfo)
                    if(res.meta.status !== 201){
                        return this.$message.error('添加失败')
                    }
                    this.$message.success('用户添加成功')
                    this.adddialogVisible = false;
                    this.getUsersList()
                })
            },
            //监听修改对话框关闭
            closeEditInfo(){
                this.$refs.editInforef.resetFields()
            },
            //提交修改信息
            editUser(){
                this.$refs.editInforef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.put('users/'+this.editUserInfo.id,{
                        email:this.editUserInfo.email,
                        mobile:this.editUserInfo.mobile,
                    })
                    if(res.meta.status !== 200){
                        return this.$message.error('修改失败')
                    }
                    this.$message.success('用户修改成功')
                    this.editdialogVisible = false;
                    this.getUsersList()
                })
            },
            //获取修改信息
            async getEditInfo(id){
                this.editdialogVisible = true;
                const {data:res} = await this.$http.get('users/'+id);
                if(res.meta.status !== 200 ){
                    return this.$message.error('获取信息失败')
                }
                this.editUserInfo = res.data;
                this.$message.success('获取用户信息成功')  
            },
            //删除
            async deluserInfo(id){
                const confirmRes = await this.$confirm('删除用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=> err)
                //如果用户确认返回值为字符串confirm 取消cancel
                if(confirmRes !== 'confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data:res} = await this.$http.delete('users/'+id)
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success('删除成功');
                this.getUsersList()
            },
            //分配角色对话框
            async setRoleInfo(row){
                this.userInfo = row;
                //获取角色列表
                const {data:res} = await this.$http.get('roles');
                if(res.meta.status !== 200 ){
                    return this.$message.error('获取角色列表失败')
                }
                this.rolesList = res.data;
                this.setRoledialogVisible = true;
            },
            //点击确定分配角色
            async saveRoleInfo(){
                if(!this.selectedRoleId){
                    return this.$message.error('请选择分配的角色')
                }
                const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId});
                if(res.meta.status !== 200 ){
                    return this.$message.error('更新角色失败')
                }
                this.$message.success('更新角色成功');
                this.getUsersList();
                this.setRoledialogVisible = false
            },
            //监听分配角色关闭
            closeSetRoledialog(){
                this.selectedRoleId = '';
                this.userInfo={}
            }
        }
    }
</script>
<style>

</style>