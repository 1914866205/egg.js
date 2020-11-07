Vue.component('toast', {
    template: '<transition name="fade"><div class="alert alert-dismissible" :class="c" role="alert" style="position: fixed;right: 10px;top: 70px;z-index: 10000;" v-if="toast"><button type="button" class="close" @click="hide"><span aria-hidden="true">&times;</span></button>{{msg}}</div></transition>',
    data: function () {
        return {
            msg: "提示",
            toast: false,
            timer: null,
            type: "danger"
        }
    },
    computed: {
        c: function () {
            return "alert-" + this.type
        }
    },
    methods: {
        hide() {
            this.toast = false
        },
        show(options) {
            this.msg = options.msg
            this.type = options.type || 'danger'
            this.toast = true
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.hide()
                this.timer = null
                if(options.success && typeof options.success === 'function'){
                    options.success()
                }
            }, options.delay || 1500);
        }
    }
})

Vue.component('confirm', {
    template: `
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document"
    :class="!isconfirm ? 'modal-lg' : ''">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">{{title}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" v-if="isconfirm">{{content}}</div>
        <div class="modal-body" v-else>
            <div class="table-responsive">
                <table class="table table-hover table-center mb-0">
                    <thead>
                        <tr>
                            <th v-for="(item,index) in ths"
                            :key="index">{{ item.title }}</th>
                        </tr>
                    </thead> 
                    <tbody>
                        <tr v-for="(item,index) in data" :key="index">
                            <td v-for="(k,ki) in ths" :key="ki">
                                <img v-if="k.type==='image'" class="avatar-sm" :src="item[k.key]" />
                                <span v-else>{{item[k.key]}}</span>
                            </td> 
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal-footer" v-if="isconfirm">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="confirm">确定</button>
        </div>
      </div>
    </div>
  </div>
    `,
    data: function () {
        return {
            content: "提示内容",
            success:null,
            isconfirm:true,
            ths:[],
            data:[],
            title:"提示"
        }
    },
    methods: {
        show(options) {
            this.title = options.title || '提示'
            this.content = options.content
            this.success = options.success || null
            this.ths = options.ths || []
            this.data = options.data || []
            this.isconfirm = options.isconfirm === false ? false : true
            $('#exampleModalCenter').modal('show')
        },
        confirm(){
            if(typeof this.success === 'function'){
                this.success()
                $('#exampleModalCenter').modal('hide')
            }
        }
    }
})

