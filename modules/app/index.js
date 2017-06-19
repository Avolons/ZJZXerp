var app = new Vue({
  el: "#vue-contaniner",
  data() {
    return {
      // 原始url
      baseUrl: "",
      //当前iframesrc
      iframeSrc: "/home.html",
      //网站地图
      mapshow: 0,
      //导航栏分类
      navbar: [
        {
          BaseParent: "XM000",
          PermissionId: 0,
          PermissionName: "系统",
          Url: null,
          Icon: null,
          Childrens: [
            {
              BaseParent: "XM000",
              PermissionId: 3,
              PermissionName: "用户管理",
              Url: "/sys/zh-CN/Tenant/User/TenantUserList",
              Icon: "icon-user",
              Childrens: [
                {
                  BaseParent: "XM000",
                  PermissionId: 77,
                  PermissionName: "用户详情",
                  Url: "/sys/User/TenantUserDetail",
                  Icon: "",
                  Childrens: [
                    {
                      BaseParent: "XM000",
                      PermissionId: 77,
                      PermissionName: "用户详情",
                      Url: "/sys/User/TenantUserDetail",
                      Sort: 0,
                      ParentId: 3
                    }
                  ],
                  Sort: 0,
                  ParentId: 3
                }
              ],
              Sort: 0,
              ParentId: 1
            }, {
              BaseParent: "XM000",
              PermissionId: 5,
              PermissionName: "角色管理",
              Url: "/sys/zh-CN/Tenant/User/TenantRoleList",
              Icon: "icon-user-md",
              Childrens: [],
              Sort: 0,
              ParentId: 1
            }
          ],
          Sort: 0,
          ParentId: -1
        }
      ],
      //  是否展开状态
      maxWidth: 0,
      //  左侧菜单栏数据
      menuList: [
        {
          BaseParent: "XM000",
          PermissionId: 3,
          PermissionName: "用户管理",
          Url: "/sys/zh-CN/Tenant/User/TenantUserList",
          Icon: "icon-user",
          click: true,
          Childrens: [
            {
              BaseParent: "XM000",
              PermissionId: 77,
              PermissionName: "用户详情",
              Url: "/sys/User/TenantUserDetail",
              Icon: "",
              click: false,
              Childrens: [
                {
                  BaseParent: "XM000",
                  PermissionId: 77,
                  PermissionName: "用户详情",
                  Url: "/sys/User/TenantUserDetail",
                  Sort: 0,
                  click: false,
                  ParentId: 3,
                  class: "asdsd"
                }
              ],
              Sort: 0,
              ParentId: 3,
              class: "asdsd"
            }
          ],
          Sort: 0,
          ParentId: 1,
          class: "asdsd"
        }, {
          BaseParent: "XM000",
          PermissionId: 5,
          click: false,
          PermissionName: "角色管理",
          Url: "/sys/zh-CN/Tenant/User/TenantRoleList",
          Icon: "icon-user-md",
          Childrens: [],
          Sort: 0,
          ParentId: 1,
          class: "asdsd"
        }
      ]
    };
  },
  methods: {
    /**
     * [网站地图展开]
     * @method mapClick
     * @return {[type]} [description]
     */
    mapClick() {
      this.mapshow === 0
        ? this.mapshow = 1
        : this.mapshow = 0;
    },
    /**
     * [网站快捷点击]
     * @method mapfast
     * @param  {number} item     [一级目录对象index下标]
     * @param  {number} tem      [二级目录对象index下标]
     * @param  {number} em       [三级目录对象index下标]
     * @param  {number} [m=null] [四级目录对象index下标]
     * @return {[type]}          [快捷点击过程]
     */
    mapfast(item, tem, em = null, m = null) {
      this.filtrate(this.navbar[item]);
      if (this.menuList[tem].click === false) {
        this.upflod_one(this.menuList[tem]);
      }
      if (em) {
        setTimeout(() => {
          let param = $(".aside_list>li").eq(tem).find("ul");
          this.upflod_two(this.menuList[tem], this.menuList[tem].Childrens[em], null, param);
          if (m) {
            let item = this.menuList[tem].Childrens[em];
            this.newIframe(item, item.Childrens[m]);
          }
        }, 10);
      }

    },
    // 左侧菜单展开更多,一级目录点击
    /**
          * [upflod description]
          * @method upflod
          * @param  {[type]} item [被点击的对象]
          * @return {[type]}      [description]
          */
    upflod_one(item) {
      this.maxWidth = 0;
      /*click状态重置*/
      /*当前目录无子级菜单，刷新当前菜单*/
      if (item.Childrens.length === 0) {
        if (item.click === false) {
          for (let item in this.menuList) {
            this.menuList[item].click = false;
          }
          item.click = true;
        }
        /*
          当前iframe刷新操作
         */
        $("iframe")[0].src = item.Url;
        window.location.href = this.baseUrl + "#" + item.id;
      } else {
        if (item.click === true) {
          item.click = false;
        } else {
          for (let item in this.menuList) {
            this.menuList[item].click = false;
          }
          item.click = true;
        }
      }
      let list = this.menuList;
      this.menuList = null;
      this.menuList = list;
    },
    /**
         * [二级目录点击]
         * @method upflod_two
         * @param  {obj}   item  父级目录对象
         * @param  {obj}   tem   当前对象
         * @param  {dom}   event dom元素
         * @description 首先获取二级目录的父元素（一级目录的dom对象）
         * 取得其当前的高度基数（由初始格式化代码赋值给class），二级目录上
         * class后也有高度基数，如果是展开状态，将基数添加到一级目录，如果是收起
         * 在一级目录上减去。
         */
    upflod_two(item, tem, event = null, $dom) {
      /*声明dom对象*/
      let parDom = null;
      /*非手动点击情况下直接dom赋值*/
      if (event === null) {
        parDom = $dom;
      } else {
        parDom = $(event.target).parents(".aside_slist");
      }
      let parclass = parDom[0].classList[2];
      //   当前的节点显示的个数
      let upnumber = parclass.slice(10) - 0;
      //   进行dom操作
      //   当前节点无子节点，选中当前节点，进行dom操作和iframe刷新
      if (tem.click === true) {
        if (tem.Childrens.length === 0) {
          return false;
        }
        tem.click = false;
        let parnum = tem.Childrens
          ? tem.Childrens.length
          : 0;
        upnumber -= parnum;
      } else {
        for (let i = 0; i < item.Childrens.length; i++) {
          /*所有被选中节点关闭，减去对应的class值*/
          if (item.Childrens[i].click === true) {
            item.Childrens[i].click = false;
            let parnum = item.Childrens[i].Childrens
              ? item.Childrens[i].Childrens.length
              : 0;
            upnumber -= parnum;
          }
        }
        let parnum = tem.Childrens
          ? tem.Childrens.length
          : 0;
        upnumber += parnum;
        tem.click = true;
      }
      let verclass = "ul_upflod-" + upnumber;
      item.class = verclass;
      if (tem.Childrens.length === 0) {
        $("iframe")[0].src = item.Url;
        window.location.href = this.baseUrl + "#" + tem.id;
      }
      let list = this.menuList;
      this.menuList = null;
      this.menuList = list;
    },
    /**
          * [导航栏筛选]
          * @method filtrate
          * @param {obj}  item nav对象
          * @return {[type]} [description]
          */
    filtrate(item) {
      for (let i = 0; i < this.navbar.length; i++) {
        this.navbar[i].click = false;
      }
      this.menuList = item.Childrens;
      item.click = true;
    },
    /**
     * [第三级目录点击函数]
     * @method newIframe
     * @param  {[type]}  tem [description]
     * @param  {[type]}  em  [description]
     * @return {[type]}      [description]
     */
    newIframe(tem, em) {
      for (let i = 0; i < tem.Childrens.length; i++) {
        tem.Childrens[i].click = false;
      }
      em.click = true;
      $("iframe")[0].src = em.Url;
      window.location.href = this.baseUrl + "#" + em.id;
      let list = this.menuList;
      this.menuList = null;
      this.menuList = list;
    },
    /**
          * [aside菜单列表的展开与收起切换]
          * @method maxcheck
          * @return {[type]} [description]
          */
    maxcheck() {
      for (let item in this.menuList) {
        this.menuList[item].click = false;
      }
      this.maxWidth === 0
        ? this.maxWidth = 1
        : this.maxWidth = 0;

    },
    /**
          * [格式化初始数据,给aside菜单列表添加额外的class属性，用于后期实现过渡效果]
          * @method verList
          * @return {[type]} [description]
          * @description 增加锚点操作，同样在此放置
          */
    verList() {
      for (let i = 0; i < this.navbar.length; i++) {
        this.navbar[i].id = i;
        this.navbar[i].click = false;
        let menuList = this.navbar[i].Childrens;
        for (let j = 0; j < menuList.length; j++) {
          menuList[j].id = i + "/" + j;
          menuList[j].click = false;
          if (menuList[j].Childrens.length>0) {
            menuList[j].class = 'ul_upflod-' + menuList[j].Childrens.length;
          }
          for (let k = 0; k < menuList[j].Childrens.length; k++) {
            menuList[j].Childrens[k].id = i + "/" + j + "/" + k;
            menuList[j].Childrens[k].click = false;
            let lastList = menuList[j].Childrens[k];
            if (lastList.Childrens.length>0) {
              lastList.class = 'ul_upflod-' + lastList.Childrens.length;
              for (let l = 0; l < lastList.Childrens.length; l++) {
                lastList.Childrens[l].id = i + "/" + j + "/" + k + "/" + l;
                lastList.Childrens[l].click = false;
              }
            }
          }
        }
      }
      this.navbar[0].click = true;
    },
    /**
     * [根据锚点定位当前页面]
     * @method addachor
     * @return {[type]} [description]
     */
    addachor() {
      let achor = window.location.href.split("#")[1];
      let self = this;
      if (achor) {
        for (let i = 0, List = this.navbar; i < List.length; i++) {
          for (let j = 0, List_1 = List[i].Childrens; j < List_1.length; j++) {
            if (achor === List_1[j].id) {
              self.mapfast(i, j);
              return false;
            }
            if (List_1[j].Childrens.length > 0) {
              for (let k = 0, List_2 = List_1[j].Childrens; k < List_2.length; k++) {
                if (achor === List_2[k].id) {
                  self.mapfast(i, j, k);
                  return false;
                }
                if (List_2[k].Childrens.length > 0) {
                  for (let l = 0, List_3 = List_2[k].Childrens; l < List_3.length; l++) {
                    if (achor === List_3[l].id) {
                      self.mapfast(i, j, k, l);
                      return false;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    const self = this;
    /**
          * [监听windows宽度，header低于750则变为缩小状态]
          * @method onresize
          * @return {[type]} [description]
          */
    window.onresize = () => {
      if ($(".lay_header").width() <= 750) {
        self.maxWidth = 1;
      }
    };
    /**基础url*/
    this.baseUrl = window.location.href.split("#")[0];
    $.getJSON("/api/test", function(data) {
      self.navbar = data.resp;
      self.menuList = self.navbar[0].Childrens;
      self.verList();
      self.addachor();
    });

  }
});
