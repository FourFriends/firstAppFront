<template>
  <div class="home">
    <h2>输入或者查询你的日程表</h2>
    <el-row display="margin-top:10px">
      <el-input
              v-model="input"
              placeholder="请输入要做的事情"
              style="display:inline-table; width: 20%; float:left">
      </el-input>
      <el-date-picker
              v-model="date"
              type="date"
              placeholder="选择日期"
              style="display:inline-table; width: 12%; float:left">
      </el-date-picker>
      <el-button type="primary" @click="AddTodoList" style="float:left; margin: 2px;">新增</el-button>
      <el-button type="primary" @click="GetTodoLists" style="float:left; margin: 2px;">拉取所有事件</el-button>
    </el-row>

    <h2>日程计划信息如下</h2>
    <el-row>
      <el-table :data="todoItemList"
                style="width: 100%"
                :row-class-name="tableRowClassName">
          <el-table-column type="index" width="50" label="序号"></el-table-column>

          <el-table-column prop="todo_date" label="计划要做时间" width="150" ></el-table-column>

          <el-table-column prop="todo_item" label="计划要做的事情" width="800"></el-table-column>

          <el-table-column prop="bFinish" label="是否完成" width="100">
              <template scope="scope"> {{ scope.row.bFinish }} </template>
          </el-table-column>

          <el-table-column
                  fixed="right"
                  label="操作"
                  width="160">
              <template slot-scope="scope">
                  <el-button @click="handleStatus(scope.row)" type="text">修改状态</el-button>
                  <el-button @click="handleDelete(scope.row)" type="text" >删除</el-button>
              </template>
          </el-table-column>

      </el-table>
    </el-row>
  </div>
</template>

<style>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>



<script>

export default {
  name: 'app',

  data () {
    return {
      input: '',
      todoItemList: [],
      date:new Date()
    }
  },


  methods:{
    GetTodoLists() {
      this.$http.get('http://129.204.173.107:8000/v2/get_todo_items')
              .then((response) => {
                var res = JSON.parse(response.bodyText)
                //console.log(res)
                if (res.error_num == 0) {
                  this.todoItemList = res['todo_lists']
                } else {
                  this.$message.error('查询书籍失败')
                  console.log(res['msg'])
                }
              })
    },
    AddTodoList(){
      if(this.input==''){
        alert("content cannot be null!")
        return;
      }
      var todo_item={"todo_item":this.input, "todo_date":this.date,"bFinish":false}
      console.log(todo_item)
      var todo_json = JSON.stringify(todo_item);
      console.log(todo_json)

      this.$http.post('http://129.204.173.107:8000/v2/post_todo_item',todo_json,{emulateJSON:true})
              .then((response) => {
                var res = JSON.parse(response.bodyText)
                console.log(res)
                if (res.error_num == 0)
                  {
                      this.GetTodoLists()
                      this.input=''
                  }
                else
                  {
                        this.$message.error('新增日程失败，请重试')
                        console.log(res['msg'])
                  }
              })
    },

    tableRowClassName({row, rowIndex}) {
      if (this.todoItemList[rowIndex].bFinish) {
        return 'success-row';
      } else {
        return 'warning-row';
      }
    },
      //修改状态
      handleStatus(row) {
          //console.log(row.pk);
          var todo_item ={}
          todo_item['id']=row.pk
          if(row.bFinish){
              todo_item['bFinish'] = false
          }
          else {
              todo_item['bFinish'] = true
          }
          console.log(todo_item)
          var todo_json = JSON.stringify(todo_item);
          //console.log(todo_json)
          this.$http.put('http://129.204.173.107:8000/v2/put_todo_item',todo_json,{emulateJSON:true})
              .then((response) => {
                  var res = JSON.parse(response.bodyText)
                  console.log(res)
                  if (res.error_num == 0)
                  {
                      this.GetTodoLists()

                  }
                  else
                  {
                      this.$message.error('修改日程状态失败，请重试')
                      console.log(res['msg'])
                  }
              })
      },
      //删除相关状态代码
      handleDelete(row) {
          //console.log(row.pk);
          var todo_item ={}
          todo_item['id']=row.pk
          var todo_json = JSON.stringify(todo_item);
          console.log(todo_json)

          this.$http.put('http://129.204.173.107:8000/v2/delete_todo_item',todo_json,{emulateJSON:true})
              .then((response) => {
                  var res = JSON.parse(response.bodyText)
                  console.log(res)
                  if (res.error_num == 0)
                  {
                      this.GetTodoLists()

                  }
                  else
                  {
                      this.$message.error('删除日程失败，请重试')
                      console.log(res['msg'])
                  }
              })
      },


  },

}
</script>


