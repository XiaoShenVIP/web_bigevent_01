// 1.开发环境服务器地址
var baseURL = "http://ajax.frontend.itheima.net";


// 拦截所有ajax请求： get/post/ajax
// 处理参数：
$.ajaxPrefilter(function (params) {
    // 拼接对应环境的服务器地址
    params.url = baseURL + params.url;
    // alert(params.url);

    // 2.为请求为/my 开头的所有ajax 配置头信息
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token" || "")
        }
    }
    // 3.身份认证判断
    params.complete = function (res) {
        console.log(res);
        // 权限认证
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.删除本地 token
            localStorage.removeItem("token");
            // 2.页面跳转
            location.href = '/login.html';
        }
    }

});