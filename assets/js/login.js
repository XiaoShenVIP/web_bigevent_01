$(function () {
    // 1. 点击注册账号
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    // 2.点击登录
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    // 自定义校验规则
    // 从layui
    var form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value) {
            var pwd = $(".reg-box input[name=password]").val()
            // 比较
            if (value !== pwd) {
                return "两次密码输入不一致！"
            }
        }
    })
    // 3.注册功能
    var layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        // 阻止默认表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                // 判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 提交成功
                layer.msg("注册成功");
                //注册后跳转登录页面
                $("#link_login").click();
            }
        });
    })

    // 4.登录功能
    $("#form_login").on("submit", function (e) {
        // 阻止默认表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 提交成功
                layer.msg("登录成功");
                // 保存token ，
                localStorage.setItem("token", res.token);
                // 跳转首页
                location.href = '/index.html'
            }
        });
    })

})