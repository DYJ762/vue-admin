<template>
    <div class="app-container">
        <div class="table-box">
            <!-- 搜索区 开始 -->
            <div class="search-box">
                <el-form ref="listQuery" :model="listQuery" label-width="90px">
                    <el-row>
                        <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
                            <el-row>
                                <!-- 表单元素 开始 -->
                                <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                                    <el-form-item label="状态" prop="status" class="select-class">
                                        <el-select v-model="listQuery.status" placeholder="请选择" clearable>
                                            <el-option v-for="item in statusOptions" :key="item.id" :label="item.text" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                                    <el-form-item label="关键词" prop="keywordsValue">
                                        <el-input v-model="listQuery.keywordsValue" placeholder="角色名称" class="input-with-select" @keyup.enter.native="handleFilter">
                                            <el-select slot="prepend" v-model="listQuery.keywordsKey" placeholder="请输入" style="width: 90px" clearable>
                                                <el-option v-for="item in keywordsKeyOptions" :key="item.id" :label="item.text" :value="item.id" />
                                            </el-select>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <!-- 表单元素 开始 -->
                            </el-row>
                        </el-col>
                        <el-col :xs="24" :sm="4" :md="4" :lg="4" :xl="4" class="search-btn">
                            <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                            <el-button @click="handleResetFilter">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!-- 搜索区 结束 -->

            <!-- 按钮功能区 开始 -->
            <el-row :gutter="10" class="btn-box">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="btnfunction-section-col">
                    <el-button type="primary" icon="el-icon-edit" @click="handleAddRole()">
                        添加
                    </el-button>
                    <el-button plain type="danger" icon="el-icon-delete" @click="handleAllDelete()">删除</el-button>
                </el-col>
            </el-row>
            <!-- 按钮功能区 结束 -->
            <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" max-height="540" @sort-change="sortChange" @selection-change="handleSelectionChange">
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 == 0 ? 'bdtop' : ' ']" v-for="(item1,i1) in scope.row.role" :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.rpid)" size="medium">{{item1.title}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级和三级权限-->
                            <!--渲染二级和三级权限-->
                            <el-col :span="19">
                                <!--通过for循环嵌套渲染二级权限-->
                                <el-row :class="[i2 == 0 ? '' : 'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRightById(scope.row, item2.rpid)" size="medium" type="success">{{item2.title}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <!--通过for循环嵌套渲染三级权限-->
                                        <el-tag size="medium" closable @close="removeRightById(scope.row, item3.rpid)" v-for="(item3) in item2.children" :key="item3.id" type="warning">{{item3.title}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="selection" align="center" />
                <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
                    <template slot-scope="{ row }">
                        <span>{{ row.role_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="角色名称" min-width="100" align="center">
                    <template slot-scope="{ row }"> {{ row.role_name }} </template>
                </el-table-column>
                <el-table-column label="角色描述" min-width="100" align="center">
                    <template slot-scope="{ row }">
                        {{ row.role_desc }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" class-name="status-col" width="100">
                    <template slot-scope="{ row }">
                        <span class="link-type" @click="handleModifyStatus(row)">
                            {{ row.status }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" width="150px" align="center">
                    <template slot-scope="{ row }">
                        <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="{ row, $index }">
                        <el-button type="primary" @click="handleEdit(row,$index)">
                            编辑
                        </el-button>
                        <el-button type="danger" @click="handleDelete(row,$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'添加角色'">
                <el-form :model="role" label-width="80px" label-position="left">
                    <el-form-item label="角色名称">
                        <el-input v-model="role.role_name" placeholder="请输入角色名称" />
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="role.role_desc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入角色描述" />
                    </el-form-item>
                    <el-form-item label="权限菜单">
                        <el-tree ref="tree" :default-expand-all="true" @check-change="handleNodeClick" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="id" class="permission-tree" />
                    </el-form-item>
                </el-form>
                <div style="text-align:right;">
                    <el-button type="danger" @click="dialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="confirmRole">确定</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    // import { getArticle } from '@/api/article'
    import { getRole } from '@/api/user'
    import { getPermission } from '@/api/permission'
    import { parseTime, deepClone } from '@/utils'

    const defaultRole = {
        key: '',
        name: '',
        description: '',
        routes: [],
    }

    export default {
        name: 'RoleIndex',
        components: {},
        filters: {
            parseTime: parseTime,
        },
        computed: {
            // routesData() {
            //     return this.routes
            // },
        },
        data() {
            return {
                role: Object.assign({}, defaultRole),
                tableKey: 0,
                list: [],
                routesData: [],
                total: 0,
                listLoading: true,
                dialogVisible: false,
                checkStrictly: false,
                dialogType: 'new',
                listQuery: {
                    page: 1,
                    limit: 20,
                    sort: '+id',
                    status: '',
                    keywordKey: '',
                    keywordValue: '',
                },
                // 来源数据字典接口
                statusOptions: [
                    { id: 1, text: '已发布' },
                    { id: 2, text: '未发布' },
                ],
                keywordsKeyOptions: [{ id: 'name', text: '角色名称' }],
                multipleSelection: [],
                // 路由参数
                routerParams: {},
                defaultProps: {
                    children: 'children',
                    label: 'title',
                },
            }
        },
        created() {
            this.routerParams = this.$route.params
            this.getList()
        },
        methods: {
            // 获取角色信息列表
            async getList() {
                this.listLoading = true
                const res = await getRole()
                this.list = res.results
                console.log(res)
                this.listLoading = false
                // setTimeout(() => {
                //     this.listLoading = false
                // }, 1.5 * 1000)
            },
            // 获取权限数据信息
            async getPremission() {
                const res = await getPermission()
                this.routesData = res.results
                console.log(this.routesData)
            },
            // 添加角色信息以及权限树
            handleAddRole() {
                this.getPremission()
                this.role = Object.assign({}, defaultRole)

                if (this.$refs.tree) {
                    this.$refs.tree.setCheckedNodes([])
                }
                this.dialogType = 'new'
                this.dialogVisible = true
            },
            //权限节点点击事件
            handleNodeClick(data) {
                console.log(this.$refs.tree.getCheckedKeys())
            },
            handleEdit(row) {
                this.dialogType = 'edit'
                this.dialogVisible = true
                this.checkStrictly = true
                console.log(row)
                this.role = deepClone(row)
                // this.$nextTick(() => {
                //     const routes = this.generateRoutes(this.role.routes)
                //     this.$refs.tree.setCheckedNodes(this.generateArr(routes))
                //     // set checked state of a node not affects its father and child nodes
                //     this.checkStrictly = false
                // })
            },
            async confirmRole() {
                const isEdit = this.dialogType === 'edit'

                const checkedKeys = this.$refs.tree.getCheckedKeys()
                // this.role.routes = this.generateTree(
                //     deepClone(this.serviceRoutes),
                //     '/',
                //     checkedKeys
                // )

                if (isEdit) {
                    await updateRole(this.role.key, this.role)
                    for (let index = 0; index < this.rolesList.length; index++) {
                        if (this.rolesList[index].key === this.role.key) {
                            this.rolesList.splice(
                                index,
                                1,
                                Object.assign({}, this.role)
                            )
                            break
                        }
                    }
                } else {
                    const { data } = await addRole(this.role)
                    this.role.key = data.key
                    this.rolesList.push(this.role)
                }

                const { description, key, name } = this.role
                this.dialogVisible = false
                this.$notify({
                    title: 'Success',
                    dangerouslyUseHTMLString: true,
                    message: `
                                                                                                                                                                                                                                                                                                                                                                                                                                            <div>Role Key: ${key}</div>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <div>Role Name: ${name}</div>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <div>Description: ${description}</div>
                                                                                                                                                                                                                                                                                                                                                                                                                                          `,
                    type: 'success',
                })
            },

            // 权限删除操作
            // 根据ID删除对应的权限
            async removeRightById(role, rightId) {
                console.log(role.role_id)
                console.log(rightId)
                // 弹框 询问用户是否删除
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该权限, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).catch(err => err)
                // 如果用户确认删除，则返回值为字符串 confirm
                // 如果用户取消删除，则返回值为字符串 cancel
                // console.log(confirmResult)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                return this.$message.success(
                    '删除角色' + role.role_name + '权限' + rightId + '成功'
                )
                // console.log('确认删除')
                // const { data: res } = await this.$http.delete(
                //     `roles/${role.id}/rights/${rightId}`
                // )
                // console.log(res)
                // if (res.meta.status !== 200) {
                //     return this.$message.error('删除权限失败')
                // }
                // this.getRolesList()
                role.children = res.data
            },

            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            // 重置搜索表单
            handleResetFilter() {
                this.listQuery.page = 1
                this.$refs['listQuery'].resetFields()
                this.getList()
            },
            handleModifyStatus(row) {
                // 这里需请求接口...
                // this.$message.success(i18n.t('common.operation_successful'))
                row.status = row.status === 'draft' ? 'published' : 'draft'
            },
            sortChange(data) {
                const { prop, order } = data
                if (prop === 'id') {
                    this.sortByID(order)
                }
            },
            sortByID(order) {
                if (order === 'ascending') {
                    this.listQuery.sort = '+id'
                } else {
                    this.listQuery.sort = '-id'
                }
                this.handleFilter()
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
            getSortClass: function (key) {
                const sort = this.listQuery.sort
                return sort === `+${key}` ? 'ascending' : 'descending'
            },
            handleAdd() {
                this.$router.push({ name: 'RoleCreate' })
            },
            // handleEdit(row) {
            //     this.$router.push({ name: 'RoleEdit', params: { id: row.id } })
            // },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            // 删除所有
            handleAllDelete() {
                if (this.multipleSelection.length === 0) {
                    this.$message.warning(i18n.t('common.delete_items_tips'))
                    return
                }
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
        },
    }
</script>
<style scoped  lang="scss" >
    .el-tag {
        margin: 7px;
    }
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
    .btn-box {
        margin-bottom: 15px;
    }
</style>