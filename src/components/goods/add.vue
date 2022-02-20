<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false" style="height: 40px;"></el-alert>
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- label位置label-position -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                  <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                      <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                      <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                      <el-input v-model="addForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                      <el-input v-model="addForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                      <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat" @change="handleChange">
                      </el-cascader>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                      <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                      <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="商品图片" name="3">
                      <!-- action上传地址on-preview预览 -->
                    <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-tab-pane>
                  <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑器组件 -->
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <!-- 添加商品的按钮 -->
                    <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                  </el-tab-pane>
                </el-tabs>
              </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>
<script>
    import _ from 'lodash';
    export default{
        data(){
            return{
                //标签和步骤条同步字段
                activeIndex:'0',
                //添加参数
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    pics: [],//图片
                    goods_introduce: '',
                    attrs: []
                },
                //验证
                addFormRules: {
                    goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                    ]
                },
                //分类列表
                catelist:[],
                cateProps: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                //动态参数列表
                manyTableData:[],
                //商品属性
                onlyTableData:[],
                // 上传图片的URL地址
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                //上传图片请求头加token
                headerObj:{
                    Authorization: window.sessionStorage.getItem('token')
                },
                //预览图片路径
                previewPath:'',
                //图片预览显示
                previewVisible:false,

            }
        },
        created(){
            this.getCateList()
        },
        methods:{
            //获取分类列表
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取数据失败！')
                }

                this.catelist = res.data
            },
            //级联改变
            handleChange(){
                //只允许选中三级分类
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                }
            },
            //标签页切换，打印name 即将离开的标签页oldActiveName即将进入的标签页activeName
            beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类！')
                    return false
                }
            },
            //标签点击事件
            async tabClicked() {
                //动态参数面板
                if (this.activeIndex === '1') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                    {
                        params: { sel: 'many' }
                    })

                    if (res.meta.status !== 200) {
                    return this.$message.error('获取列表失败！')
                    }
                    res.data.forEach(item => {
                    item.attr_vals =
                        item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    })

                    //商品参数列表
                    this.manyTableData = res.data
                } else if (this.activeIndex === '2') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                    {
                        params: { sel: 'only' }
                    }
                    )

                    if (res.meta.status !== 200) {
                    return this.$message.error('获取静态属性失败！')
                    }

                    console.log(res.data)
                    this.onlyTableData = res.data
                }
            },
            //图片预览效果
            handlePreview(file) {
                //获取预览图片路径
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            //移除图片
            handleRemove(file) {
                //获取将要删除的图片的临时路径
                const filePath = file.response.data.tmp_path;
                //从pics数组中，找到这个图片对应的索引值
                const i = this.addForm.pics.findIndex(x => x.pic === filePath);
                //调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
                this.addForm.pics.splice(i, 1);
            },
            // 监听图片上传成功
            handleSuccess(response) {
                //拼接得到一个图片信息对象
                const picInfo = { pic: response.data.tmp_path };
                // 将图片信息对象，push 到pics数组中
                this.addForm.pics.push(picInfo);
            },
            //添加商品
            add() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项！');
                    }
                    //深拷贝
                    const form = _.cloneDeep(this.addForm);
                    form.goods_cat = form.goods_cat.join(',');
                    // 处理动态参数
                    this.manyTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newInfo);
                    });
                    // 处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
                        this.addForm.attrs.push(newInfo)
                    })
                    form.attrs = this.addForm.attrs;

                    // 发起请求添加商品
                    // 商品的名称，必须是唯一的
                    const { data: res } = await this.$http.post('goods', form);

                    if (res.meta.status !== 201) {
                        return this.$message.error('添加商品失败！');
                    }

                    this.$message.success('添加商品成功！');
                    this.$router.push('/goods');
                })
            }

        },
        computed: {
            //三级分类计算属性
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        }
    }
</script>
<style>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>