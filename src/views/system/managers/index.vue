<template>
    <div class="app-container">
        <div class="table-box">
            <!-- 卡片视图 -->
            <el-card shadow="never">
                <!-- 搜索 -->
                <el-row :gutter="10" class="">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="btnfunction-section-col">
                        <el-input placeholder="请输入用户名" v-model="queryInfo.query" clearable @clear="getList">
                            <el-button slot="append" icon="el-icon-search" @click="searchUserinfo()"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </el-card>

            <el-card shadow="never">
                <!-- 按钮功能区 开始 -->
                <el-row :gutter="10" class="btn-box">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="btnfunction-section-col">
                        <el-button type="primary" icon="el-icon-edit" @click="handleAdd()">添加</el-button>
                        <el-button type="primary" @click="handleRefresh()">刷新</el-button>
                    </el-col>
                </el-row>
                <el-alert title="注意：QQ头像取决于QQ邮箱不可更改！" type="info" style="margin-bottom:15px">
                </el-alert>
                <!-- 按钮功能区 结束 -->
                <el-table v-loading="listLoading" :data="list" border fit highlight-current-row max-height="540" style="width: 100%">
                    <el-table-column align="center" label="序号">
                        <template slot-scope="{row}">
                            <span>{{ row.mg_id }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="头像">
                        <template slot-scope="scope">
                            <el-avatar :src='scope.row.avatar'></el-avatar>
                        </template>
                    </el-table-column>

                    <el-table-column label="用户名">
                        <template slot-scope="scope">
                            <span>{{ scope.row.mg_name }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="邮箱">
                        <template slot-scope="{row}">
                            <span>{{ row.mg_email }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="手机号">
                        <template slot-scope="{row}">
                            <span>{{ row.mg_mobile }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="状态" prop="mg_state" align="center">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.mg_state" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="userStateChanged(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" class-name="status-col" label="角色">
                        <template slot-scope="{row}">
                            <el-tag :type="row.status | statusFilter">
                                {{ row.role_name }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" fixed="right" label="操作" width="230" class-name="small-padding fixed-width">
                        <template slot-scope="{row}">
                            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(row)">
                                编辑
                            </el-button>
                            <el-button class="" icon="el-icon-refresh" type="warning" @click="handleDelete(row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <!-- 添加用户的对话框 -->
            <Dialog ref="dialog" :dialogType="dialogType" :formData='formData' @update="getList"></Dialog>
        </div>
    </div>
</template>

<script>
    import { getManagers, managerState, selectManager } from '@/api/user'
    import { parseTime } from '@/utils'
    import Dialog from './dialog.vue'

    export default {
        name: 'InlineEditTable',
        components: {
            Dialog,
        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'info',
                    deleted: 'danger',
                }
                return statusMap[status]
            },
            parseTime: parseTime,
        },
        data() {
            return {
                dialogType: 'new',
                list: null,
                listLoading: true,
                // listQuery: {
                //     query: '',
                //     page: 1,
                //     limit: 10,
                // },
                // 获取用户列表查询参数对象
                queryInfo: {
                    query: '',
                },
                listQuery: {
                    // 当前页数
                    pagenum: 1,
                    // 每页显示多少数据
                    pagesize: 10,
                },
                formData: {},
            }
        },
        created() {
            this.getList()
        },
        methods: {
            async getList() {
                this.listLoading = true
                const res = await getManagers(this.listQuery)
                if (res.status !== 200) {
                    return this.$message.error(res.message)
                }
                this.list = res.results
                setTimeout(() => {
                    this.listLoading = false
                }, 1000)
            },
            //刷新
            handleRefresh() {
                this.getList()
            },
            cancelEdit(row) {
                row.mg_name = row.originalTitle
                row.edit = false
                this.$message({
                    message: '已取消编辑操作!',
                    type: 'warning',
                })
            },
            confirmEdit(row) {
                row.edit = false
                row.originalTitle = row.mg_name
                console.log(row)
                this.$message({
                    message: '编辑成功!',
                    type: 'success',
                })
            },
            // 监听 switch开关 状态改变
            // async userStateChanged(id) {
            async userStateChanged(data) {
                console.log(data)
                const { status, message } = await managerState(data)
                if (status !== 200) {
                    data.mg_state = !data.mg_state
                    return this.$message.error(message)
                }
                this.$message.success(message)
            },
            // 模糊查询
            async searchUserinfo() {
                const res = await selectManager(this.queryInfo)
                if (res.status !== 200) {
                    return this.$message.error(res.message)
                }
                console.log(res)
                this.list = res.results
                //分页处理
                this.total = res.results.length
                this.$message.success(res.message)
            },
            // 添加用户弹出对话框
            handleAdd() {
                this.$refs.dialog.showDialog()
                this.dialogType = 'new'
            },
            // 编辑用户弹出对话框
            handleEdit(row) {
                this.$refs.dialog.showDialog()
                this.dialogType = 'edit'
                console.log(row.mg_id)
                this.formData = Object.assign({}, row)
            },
            // 删除用户操作
            handleDelete() {},
        },
    }
</script>

<style scoped>
    /* .edit-input {
                                                                                                                                                                                                                                                                                                                                            padding-right: 100px;
                                                                                                                                                                                                                                                                                                                                        } */
    .cancel-btn {
        position: absolute;
        right: 15px;
        top: 10px;
    }
</style>
