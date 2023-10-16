<template>
    <div class="search-div">
        <!-- 搜索表单 -->
        <el-form label-width="70px" size="small">
            <el-form-item label="角色名称">
                <el-input style="width: 100%" placeholder="角色名称" v-model="dto.roleName"></el-input>
            </el-form-item>
            <el-row style="display:flex">
                <el-button type="primary" size="small" @click="fetchData(1)">
                    搜索
                </el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </el-row>
        </el-form>

        <!-- 添加按钮 -->
        <div class="tools-div">
            <el-button type="success" size="small" @click="addShow">添 加</el-button>
        </div>

        <!--- 角色表格数据 -->
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="roleName" label="角色名称" width="180" />
            <el-table-column prop="roleCode" label="角色code" width="180" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作" align="center" width="280" #default="scope">
                <el-button type="primary" size="small" @click="updateShow(scope.row)">
                    修改
                </el-button>
                <el-button type="danger" size="small" @click="remove(scope.row.id)">
                    删除
                </el-button>
            </el-table-column>
        </el-table>

        <!--分页条-->
        <el-pagination v-model:current-page="pageParam.pageNum" v-model:page-size="pageParam.pageSize"
            :page-sizes="[2, 5, 10, 20]" @size-change="handleSizeChange" @current-change="fetchData"
            layout="total, sizes, prev, pager, next" :total="total" />



        <!-- 添加角色表单对话框 -->
        <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
            <el-form label-width="120px">
                <el-form-item label="角色名称">
                    <el-input v-model="sysRoleForm.roleName" />
                </el-form-item>
                <el-form-item label="角色Code">
                    <el-input v-model="sysRoleForm.roleCode" />
                </el-form-item>
                <el-form-item label="描述信息">
                    <el-input v-model="sysRoleForm.description" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>



    </div>
</template>







<script setup>
import { ref, onMounted } from 'vue';
import { findPage, add, update,removeById } from '@/api/sysRole'
import { ElMessage, ElMessageBox } from 'element-plus'

//--------------------------------------------------

// 分页条总记录数
let total = ref(0)

// 定义表格数据模型
let list = ref([
    /* {"id":9 ,  "roleName": "系统管理员" , "roleCode":"xtgly","createTime": '2023-07-31'},
    {"id":10 , "roleName": "商品管理员" , "roleCode":"spgly","createTime": '2023-07-31'} */
])

const pageParam = ref({
    pageNum: 1,
    pageSize: 2
})

const dto = ref({
    roleName: ''
})

const dialogVisible = ref(false)

const sysRoleForm = ref({
    id: '',
    roleName: '',
    roleCode: '',
    description: ''
})

//--------------------------------------------------

onMounted(() => {
    fetchData()
})

const handleSizeChange = (number) => {
    pageParam.value.pageSize = number
    fetchData()
}

const fetchData = async (pageNum = 1) => { //fetchData函数调用时没有传参情况下，pageNum默认值就是1；如果传参，按照参数进行分页查询
    pageParam.value.pageNum = pageNum
    const { code, message, data } = await findPage(pageParam.value.pageNum, pageParam.value.pageSize, dto.value);
    total.value = data.total
    list.value = data.list
}

const reset = () => {
    dto.value = {}
    fetchData()
}


//添加  -  弹框
const addShow = () => {
    dialogVisible.value = true
    sysRoleForm.value = {}
}


const submit = async () => {
    if (!sysRoleForm.value.id) { //添加
        await add(sysRoleForm.value)
        ElMessage.success('保存成功')
        dialogVisible.value = false
        fetchData()
    } else { //修改
        await update(sysRoleForm.value)
        ElMessage.success('修改成功')
        dialogVisible.value = false
        fetchData(pageParam.value.pageNum)
    }

}

const updateShow = (row) => {
    //直接通过插槽获取行，进行修改页面表单回显，可以回显，但是存在瑕疵。
    //表单数据修改，列表行数据也跟着修改，取消修改操作，行显示的是修改的值，但是，实际上并没有修改数据库，刷新页面恢复正常值。
    sysRoleForm.value = row
    dialogVisible.value = true
}


const remove = (id) => {
    ElMessageBox.confirm('您确定要删除数据吗?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type: 'warning'
    }).then( async()=>{ //确定按钮
        await removeById(id)
        ElMessage.success('删除成功')
        fetchData()
    }).catch((e)=>{ //取消按钮或请求异常
        if('cancel' === e){
            ElMessage.info('取消操作')
        }else{
            ElMessage.error('请求失败')
        }
    })
}

</script>









<style scoped>
.search-div {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 3px;
    background-color: #fff;
}

.tools-div {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 3px;
    background-color: #fff;
}
</style>