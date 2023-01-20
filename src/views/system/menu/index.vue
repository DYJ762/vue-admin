<template>
    <div class="app-container">
        <el-card shadow="never">
            <!-- 按钮功能区 开始 -->
            <el-row :gutter="10" class="btn-box">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="btnfunction-section-col">
                    <el-button type="primary" icon="el-icon-edit" @click="handleAdd()">添加</el-button>
                    <el-button type="primary" icon="el-icon-minus" @click="handleUpDown()">展开/收起</el-button>
                    <el-button type="primary" @click="handleRefresh()">刷新</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 按钮功能区 结束 -->

        <!-- Note that row-key is necessary to get a correct row order.   table当前行高亮属性highlight-current-row-->
        <el-card shadow="never">
            <el-table ref="treeTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%" :indent="16" @selection-change="handleSelectionChange" @select-all="selectAll">
                <el-table-column type="selection" align="center" fixed="left" />
                <el-table-column align="center" label="ID" type="" width="110">
                    <template slot-scope="{ row }">
                        <span>{{ row.id }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="left" label="菜单标题" class-name="menuIcon" min-width="150px">
                    <template slot-scope="{ row }">
                        <span>{{ row.title }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="菜单类型" min-width="100px">
                    <template slot-scope="{ row }">
                        <el-tag v-if="row.level === 0">一级菜单</el-tag>
                        <el-tag type="success" v-else-if="row.level === 1">二级菜单</el-tag>
                        <el-tag type="warning" v-else>三级菜单</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="菜单图标" min-width="80px">
                    <template slot-scope="{ row }">
                        <el-tooltip class="item" effect="dark" :content="row.icon" placement="top">
                            <i :class="row.icon"></i>
                        </el-tooltip>
                        <!-- <i :icon="row.icon" :title="row.name" />
                        <span>
                            {{row.icon}}
                        </span> -->
                    </template>
                </el-table-column>

                <el-table-column align="center" label="路由名称" min-width="150px">
                    <template slot-scope="{ row }">
                        <span>{{ row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="路由地址" min-width="150px">
                    <template slot-scope="{ row }">
                        <span>{{ row.path }}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="页面组件" min-width="150px">
                    <template slot-scope="{ row }">
                        <span>{{ row.component }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="创建时间" width="200" align="center">
                    <template slot-scope="{ row }">
                        <span>{{ row.create_time| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
                    <template slot-scope="{ row, $index }">
                        <el-button type="primary" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button type="danger" @click="handleDelete(row,$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--表单渲染-->
        <el-dialog append-to-body :before-close="handleClose" :close-on-click-modal="false" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'添加菜单'" width="580px">
            <el-form :model="form" ref="formRef" :rules="formRules" label-width="100px">
                <el-form-item label="菜单名称" prop="title">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限类型">
                    <el-radio-group>
                        <el-radio-button label="菜单"></el-radio-button>
                        <el-radio-button label="按钮" disabled></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单类型" prop="level">
                    <el-radio-group v-model="form.level">
                        <el-radio-button label="0">一级菜单</el-radio-button>
                        <el-radio-button label="1">二级菜单</el-radio-button>
                        <el-radio-button label="2">三级菜单</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="form.icon" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="路由名称" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="路由地址" prop="path">
                    <el-input v-model="form.path" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="页面组件" prop="component">
                    <el-input v-model="form.component" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getPermission } from '@/api/permission'
    import { parseTime } from '@/utils'
    import { treeToFlat } from '@/utils/tree'

    export default {
        name: 'MenuIndex',
        components: {},
        filters: {
            parseTime: parseTime,
        },
        data() {
            return {
                isExpand: false,
                list: [],
                total: 0,
                listLoading: true,
                multipleSelection: [],
                isSelected: false,
                flatList: [],
                oldList: [],
                newList: [],
                menuList: [],
                // 弹窗
                dialogType: 'new',
                dialogVisible: false,
                form: {
                    title: '',
                },
                // 表单验证规则
                formRules: {
                    title: [
                        {
                            required: true,
                            message: '请输入菜单标题',
                            trigger: 'blur',
                        },
                        {
                            min: 2,
                            max: 10,
                            message: '用户名的长度在2～10个字',
                            trigger: 'blur',
                        },
                    ],
                },
            }
        },
        created() {
            this.getList()
        },
        methods: {
            // clipboard,
            async getList() {
                this.listLoading = true
                // 模拟请求
                const { results } = await getPermission()
                this.list = results
                this.menuList = results
                this.flatList = treeToFlat(results)
                console.log(this.flatList)
                // this.total = this.menuList.length
                setTimeout(() => {
                    this.listLoading = false
                }, 1000)
                // this.listLoading = false
            },
            handleDelete(row, index) {
                this.$confirm(
                    i18n.t('common.delete_confirm_tips'),
                    i18n.t('common.warm_tips'),
                    {
                        confirmButtonText: i18n.t('common.confirm'),
                        cancelButtonText: i18n.t('common.cancel'),
                        type: 'warning',
                    }
                )
                    .then(() => {
                        // 这里需请求删除接口...
                        // this.list.splice(index, 1)
                        this.$message.success(i18n.t('common.deleted'))
                    })
                    .catch(() => {
                        this.$message.info(i18n.t('common.canceled'))
                    })
            },
            // 添加操作
            handleAdd() {
                this.dialogVisible = true
                this.dialogType = 'new'
                this.form = {}
            },
            // 编辑操作
            handleEdit(row) {
                this.dialogVisible = true
                this.dialogType = 'edit'
                this.form = Object.assign({}, row)
            },
            submit() {
                // 提交请求前，表单预验证
                this.$refs.formRef.validate(async valid => {
                    // console.log(valid)
                    // 表单预校验失败
                    if (!valid) return
                    // 表单预校验成功
                    this.dialogVisible = false
                    this.dialogType === 'new'
                        ? this.$notify({
                              title: '提示信息',
                              message: '添加成功',
                              type: 'success',
                          })
                        : this.$notify({
                              title: '提示信息',
                              message: '修改成功',
                              type: 'success',
                          })
                })
            },

            handleModifyStatus(row, status) {
                this.$message.success(i18n.t('common.operation_successful'))
                // 这里需请求删除接口...
                row.status = row.status === 'draft' ? 'published' : 'draft'
            },
            // 展开、收起数据处理
            downUpData(data, isExpand) {
                data.forEach(i => {
                    this.$refs.treeTable.toggleRowExpansion(i, isExpand)
                    if (i.children) {
                        this.downUpData(i.children, isExpand)
                    }
                })
            },
            handleUpDown() {
                this.isExpand = !this.isExpand
                this.downUpData(this.list, this.isExpand)
            },
            //刷新
            handleRefresh() {
                this.getList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
                console.log(this.multipleSelection)
            },
            selectAll(selection) {
                this.isSelected = !this.isSelected
                this.flatList.forEach((row, index) => {
                    this.$refs.treeTable.toggleRowSelection(row, this.isSelected)
                })
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done()
                    })
                    .catch(_ => {})
            },
        },
    }
</script>

<style scoped>
    .btnfunction-section-col button {
        margin: 0 10px 10px 0;
    }
</style>