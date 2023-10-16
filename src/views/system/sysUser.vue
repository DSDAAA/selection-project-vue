<template>

    <!---搜索表单-->
    <div class="search-div">
        <el-form label-width="70px" size="small">
            <el-row>
                <el-col :span="12">
                <el-form-item label="关键字">
                    <el-input v-model="dto.keyword"
                    style="width: 100%"
                    placeholder="用户名、姓名、手机号码"
                    ></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建时间">
                        <el-date-picker
                        type="daterange"
                        range-separator="To"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        v-model="startEndTime"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="display:flex">
                <el-button type="primary" size="small" @click="searchData">
                搜索
                </el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </el-row>
        </el-form>
    </div>

    <!--添加按钮-->
    <div class="tools-div">
        <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <!---数据表格-->
    <el-table :data="list" style="width: 100%">
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="手机" />
        <el-table-column prop="avatar" label="头像" #default="scope">
            <img :src="scope.row.avatar" width="50" />
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态" #default="scope">
            {{ scope.row.status == 1 ? '正常' : '停用' }}
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" align="center" width="280" #default="scope">
            <el-button type="primary" size="small" @click="updateShow(scope.row)">
                修改
            </el-button>
            <el-button type="danger" size="small" @click="remove(scope.row.id)">
                删除
            </el-button>
            <el-button type="warning" size="small">
                分配角色
            </el-button>
        </el-table-column>
    </el-table>

    <el-pagination 
            v-model:current-page="pageParam.pageNum" 
            v-model:page-size="pageParam.pageSize"
            :page-sizes="[2, 5, 10, 20]" 
            @size-change="handleSizeChange" 
            @current-change="fetchData"
            layout="total, sizes, prev, pager, next" :total="total" />

    <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
        <el-form label-width="120px">
            <el-form-item label="用户名">
                <el-input v-model="sysUser.userName"/>
            </el-form-item>
            <el-form-item v-if="sysUser.id == null" label="密码">
                <el-input type="password" show-password v-model="sysUser.password"/>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="sysUser.name"/>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="sysUser.phone"/>
            </el-form-item>
            <el-form-item label="头像">
                <el-upload
                        class="avatar-uploader"
                        action="http://localhost:8501/admin/system/fileUpload"
                        :show-file-list="false"
                        >
                    <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="描述">
                <el-input  v-model="sysUser.description"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

</template>

<script setup>
import { ref,onMounted } from 'vue'; 
import { findPage,add,update,removeById } from '@/api/sysUser'
import { ElMessage, ElMessageBox } from 'element-plus'
//--------------------------------------------

// 表格数据模型
const list = ref([
    /* {"id":1 , "userName":"admin" , "name": "admin" , "phone":"13121034567" , "status":1 , "createTime": "2023-05-11"} ,
    {"id":2 , "userName":"admin" , "name": "admin" , "phone":"13121034567" , "status":1 , "createTime": "2023-05-11"}  */
]);

// 分页条数据模型
const total = ref(0)

const pageParam = ref({
    pageNum: 1,
    pageSize: 2
})

const startEndTime = ref([])

const dto = ref({
    keyword:'',
    createTimeBegin:'',
    createTimeEnd: ''
})

const sysUser = ref({
    id: '',
    userName: '',
    password: '',
    name: '',
    phone: '',
    avatar: '',
    description: ''
})

const dialogVisible = ref(false)


//--------------------------------------------
onMounted(()=>{
    fetchData()
})

const fetchData  =  async(pageNum = 1)=>{
    pageParam.value.pageNum = pageNum
    const {code,message,data} = await findPage(pageParam.value.pageNum,pageParam.value.pageSize,dto.value)
    total.value = data.total
    list.value = data.list
}

const handleSizeChange = (number) => {
    pageParam.value.pageSize = number
    fetchData()
}

const searchData = ()=>{
    debugger
    //将开始时间和结束时间，从数组中获取，赋值到dto中。
    if(startEndTime.value!=null && startEndTime.value.length ==2){
        dto.value.createTimeBegin = startEndTime.value[0]+' 00:00:00'
        dto.value.createTimeEnd = startEndTime.value[1]+' 23:59:59'
    }

    fetchData()
}

const reset = () => {
    dto.value = {}
    fetchData()
}


//添加  -  弹框
const addShow = () => {
    dialogVisible.value = true
    sysUser.value = {}
}


const submit = async () => {
    if (!sysUser.value.id) { //添加
        await add(sysUser.value)
        ElMessage.success('保存成功')
        dialogVisible.value = false
        fetchData()
    } else { //修改
        await update(sysUser.value)
        ElMessage.success('修改成功')
        dialogVisible.value = false
        fetchData(pageParam.value.pageNum)
    }

}


const updateShow = (row) => {
    sysUser.value = row
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
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>