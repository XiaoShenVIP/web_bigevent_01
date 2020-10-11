$(function () {
    // 文章类别列表显示
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-art-cate', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 2.显示添加文章分类列表
    var layer = layui.layer;

    $("#btnAdd").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-add").html(),
        });
    })
    // 3.提交文章分类添加（事件委托）
    var indexAdd = null;
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();

        // 发送 ajax请求添加
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章类别添加失败！')
                }
                layer.msg('文章类别添加成功！')

                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })

    // 4.修改  展示菜单
    var indexEdit = null;
    var form = layui.form;
    $("tbody").on("click", ".btn-edit", function () {
        // 4.1
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-edit").html(),
        });

        // 4.2获取Id  ，发送ajax请求获取数据  渲染到页面
        var Id = $(this).attr("data-id");
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val("form-edit", res.data);
            }
        })
    })


    // 5.submit 提交修改
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg("修改成功！");
                layer.close(indexEdit);
            }
        })
    })

    // 6.删除
    $("tbody").on("click", ".btn-delete", function () {
        var Id = $(this).attr("data-id");
        //eg1
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败！")
                    }
                    initArtCateList();
                    layer.msg("删除成功！");
                    layer.close(index);
                }
            })
        });
    })

})