$(function () {
    // 1.自定义验证规则
    var form = layui.form

    form.verify({
        // 所有密码验证
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            var v2 = $("[name=oldPwd]").val()
            if (value == v2) {
                return "原密码和旧密码不能相同!";
            }
        },
        rePwd: function (value) {
            var v3 = $("[name=newPwd]").val()
            if (value !== v3) {
                return "两次密码输入不一致!";
            }
        }

    })

    // 2.修改密码
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败！');
                }
                layui.layer.msg('成功修改密码！')
                $(".layui-form")[0].reset();
            }
        })
    }
    )

})