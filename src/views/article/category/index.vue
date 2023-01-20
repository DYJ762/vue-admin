<!-- 添加文章分类 -->
<template>
    <div class="app-container">
        <!-- 卡片视图 -->
        <el-card shadow="never">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 分类表格
        :data(设置数据源) :columns(设置表格中列配置信息) :selection-type(是否有复选框)
        :expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)
        border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮) -->
            <!-- 表格 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" index-text="#" :show-row-hover="true" show-index :index="tableIndex" border>
                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cate_deleted === 1"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cate_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cate_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 描述 -->
                <template slot="desc" slot-scope="scope">
                    {{scope.row.cate_desc}}
                </template>

                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit-outline" size="mini" @click="showEditCateDialog(scope.row.cate_id)">编辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cate_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
        </el-card>

        <!-- 编辑文章分类的对话框 -->

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cate_name">
                    <el-input v-model="addCateForm.cate_name"></el-input>
                </el-form-item>
                <el-form-item label="分类描述：" prop="cate_desc">
                    <el-input type="textarea" v-model="addCateForm.cate_desc"></el-input>
                </el-form-item>
                <!-- options：数据源 -->
                <!-- props：指定配置对象 -->
                <el-form-item label="父级分类：">
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged" clearable filterable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getCategory,
        getCategory_parent,
        addCategory,
        delCategory,
    } from '@/api/article'
    export default {
        data() {
            return {
                // 商品分类数据
                cateList: [
                    // 分类名称---cat_name
                    // 分类父级id---cat_pid
                    // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类---cat_level
                    // { cat_name: "编程学习", cat_pid: 1, cat_level: 0 },
                ],
                // 选中的父级Id数组
                selectedKeys: [],
                // 父级分类列表
                parentCateList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    checkStrictly: true,
                    // 配置触发选项 hover/click
                    expandTrigger: 'click',
                    value: 'cate_id',
                    label: 'cate_name',
                    children: 'children',
                },

                total: 0,
                // 为table指定列的定义
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cate_name',
                        width: '200',
                    },
                    {
                        label: '是否有效',
                        // 当前列 自定义模板
                        type: 'template',
                        template: 'isOk',
                        width: '100',
                        align: 'center',
                    },
                    {
                        label: '排序',
                        // 当前列 自定义模板
                        type: 'template',
                        template: 'order',
                        width: '100',
                        align: 'center',
                    },
                    {
                        label: '分类描述',
                        // 当前列 自定义模板
                        type: 'template',
                        template: 'desc',
                    },

                    {
                        label: '操作',
                        // 当前列 自定义模板
                        type: 'template',
                        template: 'opt',
                        width: '200',
                        align: 'center',
                    },
                ],
                addCateDialogVisible: false,
                // 添加分类对象
                addCateForm: {
                    // 将要添加分类名称
                    cate_name: '',
                    // 分类父级id
                    cate_pid: 0,
                    // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
                    cate_level: 0,
                },
                // 添加分类表单的验证规则
                addCateFormRules: {
                    cate_name: [
                        {
                            required: true,
                            message: '请输入分类名称',
                            trigger: 'blur',
                        },
                    ],
                },
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            // 获取商品分类
            async getCateList() {
                const res = await getCategory()
                if (res.status !== 200) {
                    return this.$message.error(res.message)
                }
                console.log(res.results)
                this.cateList = res.results
                //分页处理
                this.total = res.total
            },
            // 监听 pagesize改变的事件
            handleSizeChange(newSize) {
                // console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            // 监听 页码值 改变事件
            handleCurrentChange(newSize) {
                // console.log(newSize)
                this.queryInfo.pagenum = newSize
                this.getCateList()
            },
            // 添加操作
            showAddCateDialog() {
                // 先获取父级分类数据
                this.getParentCateList()
                // 再打开对话框
                this.addCateDialogVisible = true
            },
            // 获取一级和二级分类的数据
            async getParentCateList() {
                // const { data: res } = await this.$http.get('category_parent', {
                //     params: { level: 1 },
                // })
                const res = await getCategory_parent({ level: 1 })
                if (res.status !== 200) {
                    return this.$message.error(res.message)
                }
                this.parentCateList = res.results
                console.log(this.parentCateList)
            },
            // 添加分类 选择项发生变化触发
            parentCateChanged() {
                // 如何selectKeys 数组的长度>0 说明选中父级分类
                if (this.selectedKeys.length > 0) {
                    // 父级分类的Id
                    this.addCateForm.cate_pid =
                        this.selectedKeys[this.selectedKeys.length - 1]
                    // 当前分类的等级
                    this.addCateForm.cate_level = this.selectedKeys.length
                    return 0
                } else {
                    // 父级分类的Id
                    this.addCateForm.cate_pid = 0
                    // 当前分类的等级
                    this.addCateForm.cate_level = 0
                }
            },
            // 添加分类
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const res = await addCategory(this.addCateForm)
                    console.log(this.addCateForm)
                    if (res.status !== 200) {
                        return this.$message.error(res.message)
                    }

                    return this.$message.success(res.message)
                    this.getCateList()
                    this.addCateDialogVisible = false
                })
            },
            // 监听 添加分类对话框的关闭事件
            addCateDialogClosed() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cate_level = 0
                this.addCateForm.cate_pid = 0
            },
            // 删除分类
            async removeCate(id) {
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该分类, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除！')
                }
                const res = await delCategory(id)
                if (res.status !== 200) {
                    return this.$message.error(res.message)
                }
                this.$message.success(res.message)
                this.getCateList()
            },
            showEditCateDialog(id) {
                console.log(id)
            },
            // addCate() {
            //     this.$message.success("添加成功！");
            //     this.addCateDialogVisible = false;
            // },
            //分页累加问题解决
            tableIndex(index) {
                return (
                    (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize +
                    index +
                    1
                )
            },
        },
    }
</script>

<style scoped>
    .treeTable {
        margin-top: 15px;
    }
</style>