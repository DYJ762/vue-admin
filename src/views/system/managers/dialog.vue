<template>
    <!-- 添加用户的对话框 -->
    <el-dialog :title="dialogType==='edit'?'编辑角色':'添加角色'" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体 -->
        <el-form :model="formData" ref="formRef" :rules="formRules" label-width="100px">
            <el-form-item label="用户名" prop="mg_name">
                <el-input v-model="formData.mg_name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="mg_pwd">
                <el-input v-model="formData.mg_pwd"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="mg_email">
                <el-input v-model="formData.mg_email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mg_mobile">
                <el-input v-model="formData.mg_mobile"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role_id">
                <el-select v-model="formData.role_id" placeholder="请选择所属角色">
                    <el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name" :value="item.role_id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { addManager, getRole } from '@/api/user'
    export default {
        name: 'dialog',
        props: {
            dialogType: {
                type: String,
                default: 'new',
            },
            formData: {
                typeof: Object,
                default: {},
            },
        },
        data() {
            // 自定义邮箱规则
            var checkEmail = (rule, value, callback) => {
                const regEmail = /^\w+@\w+(\.\w+)+$/
                if (regEmail.test(value)) {
                    // 合法邮箱
                    return callback()
                }
                callback(new Error('请输入合法邮箱'))
            }
            // 自定义手机号规则
            var checkMobile = (rule, value, callback) => {
                const regMobile = /^1[34578]\d{9}$/
                if (regMobile.test(value)) {
                    return callback()
                }
                // 返回一个错误提示
                callback(new Error('请输入合法的手机号码'))
            }
            return {
                //获取角色列表
                roleList: [],
                token: '',
                dialogVisible: false,
                // // 用户添加
                // formData: {
                //     mg_name: '',
                //     mg_pwd: '',
                //     mg_email: '',
                //     mg_mobile: '',
                //     role_id: '',
                // },
                // 用户添加表单验证规则
                formRules: {
                    mg_name: [
                        {
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur',
                        },
                        {
                            min: 2,
                            max: 10,
                            message: '用户名的长度在2～10个字',
                            trigger: 'blur',
                        },
                    ],
                    mg_pwd: [
                        {
                            required: true,
                            message: '请输入用户密码',
                            trigger: 'blur',
                        },
                        {
                            min: 6,
                            max: 18,
                            message: '用户密码的长度在6～18个字',
                            trigger: 'blur',
                        },
                    ],
                    mg_email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' },
                    ],
                    mg_mobile: [
                        {
                            required: true,
                            message: '请输入手机号码',
                            trigger: 'blur',
                        },
                        { validator: checkMobile, trigger: 'blur' },
                    ],
                    role_id: [
                        {
                            required: true,
                            message: '请选择角色项!',
                            trigger: 'blur',
                        },
                    ],
                },
            }
        },
        created() {
            this.getRoleList()
        },
        methods: {
            async getRoleList() {
                const res = await getRole()
                if (res.status !== 200) {
                    return this.$message.error(res.message)
                }
                this.roleList = res.results
                console.log(this.roleList)
            },
            showDialog() {
                this.dialogVisible = true
            },
            // 监听 添加用户对话框的关闭事件
            addDialogClosed() {
                this.$refs.formRef.resetFields()
            },
            addUser() {
                // 提交请求前，表单预验证
                this.$refs.formRef.validate(async valid => {
                    // 表单预校验失败
                    if (!valid) return
                    const res = await addManager(this.addUserForm)
                    if (res.status !== 200) {
                        return this.$message.error(res.message)
                    }
                    console.log(res)
                    this.$message.success(res.message)
                    // 隐藏添加用户对话框
                    this.dialogVisible = false
                    this.$emit('update')
                })
            },
        },
    }
</script>
