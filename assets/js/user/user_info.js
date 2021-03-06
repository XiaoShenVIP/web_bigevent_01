$(function () {
    // 1.自定义校验
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6个字符之间"
            }
        }
    })
    // 2.初始化用户信息
    initUserInfo();
    // 初始化用户封装
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 3.重置表单的数据
    // 给form表单绑定  reset  给按钮用 click
    $("#btnReset").on("click", function (e) {

        e.preventDefault();
        initUserInfo();
    })
    //4.修改用户信息
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        // 发送ajax，修改用户信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg("恭喜您，修改用户信息成功! ");
                // 调用父框架的全局方法
                window.parent.getUserInfo();
            }
        })
    })

})