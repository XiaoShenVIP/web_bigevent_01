$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 为art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr);

        var y = dt.getFullYear()
        var m = dt.getMonth() + 1
        var d = dt.getDate()
        var hh = dt.getHours()
        var mm = dt.getMinutes()
        var ss = dt.getSeconds()

        return y + '-' + m + '-' + d + '-' + hh + '-' + mm + '-' + ss
    }

    // 在个位数的左侧填充 0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 1.定义提交参数
    var q = {
        pagenum: 1,    		//页码值
        pagesize: 2,			//每页显示多少条数据
        cate_id: "",    		//文章分类的 Id
        state: "",    		//文章的状态，可选值有：已发布、草稿
    };

    // 2.初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取失败");
                }
                layer.msg("获取文章列表成功");
                // 成功获取数据 渲染到页面
                var str = template("tpl-table", res);
                $("tbody").html(str);
                // 渲染分页
                renderPage(res.total)
            }
        })
    }
    // 3.初始化分类
    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // 
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    // 4.筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();

    })

    // 5.分页
    var laypage = layui.laypage;

    function renderPage(total) {
        // alert(num)
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        })
    }

    // 6.删除

    // var layer = layui.layer;
    $("tbody").on("click", ".btn-delete", function () {
        var id = $(this).attr("data-id");
        // alert(11)
        // 4.1显示对话框
        layer.confirm('是否确认删除 ?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 渲染你页面数据
                    layer.msg(res.message)
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable()

                }
            })
            layer.close(index);
        });
    })


})



