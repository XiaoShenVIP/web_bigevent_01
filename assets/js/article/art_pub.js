$(function () {
    //初始化分类
    var form = layui.form;
    var layer = layui.layer;

    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // 
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // layer.msg(res.message);
                var htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 4.点击按钮选择图片

    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();

    })

    // 5.设置图片
    $("#coverFile").change(function (e) {
        var files = e.target.files[0]
        if (files.length === 0) {
            return layer.msg("请选择图片")
        }
        // 根据选择的文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(files)

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 6.设置状态
    var state = "已发布";
    $("#btnSave2").on("click", function () {
        state = "草稿";
    })

    // 7.添加文章
    $("#form-pub").on("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append("state", state);

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 5. 将文件对象，存储到 fd 中
                // console.log(...fd);
                // fd.forEach(function (v, k) {
                //     console.log(v, k);
                //     console.log(k);

                // })
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
        // art_list   添加成功，跳转中。。。
        // 6.添加文章
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    // 跳转页面
                    // location.href = "/article/art_list.html";
                    // 去除bug
                    layer.msg(" 添加成功，跳转中。。。")
                    setTimeout(function () {
                        window.parent.document.querySelector("#art_list").click();
                    }, 500)
                }
            })
        }

    })


})