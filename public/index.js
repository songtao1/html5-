(function(){
    $(document).ready(function() {
        var $a = $("a[href*='item']");
        $a.each(
            function() {
                $(this).on('click',
                    function() {
                        $('html,body').animate({
                            scrollTop: ($($.attr(this, 'href')).offset().top - 30)
                        }, 500);
                        $(".menu_list").removeClass("menu_list_show");
                        return false;
                    })
            }
        )
    })
    
        // 第一个form
        var formVal = document.forms["form1"], dom = '#registerForm .tips';
        var timer;
        var apiUrl = "https://marketing.feeclouds.com";
        function testCompany(obj,dom){
            var val = $.trim(obj['company'].value);
            if(!val){
                $(dom).eq(0).html("请输入公司名称");
                return false;
            }
            $(dom).eq(0).html("");
            return true;
        }
        function testName(obj,dom){
            var val = $.trim(obj['name'].value);
            if(!val){
                $(dom).eq(1).html("请输入您的姓名");
                return false;
            }
            $(dom).eq(1).html("");
            return true;
        }
        function testPhone(obj,dom){
            var val = $.trim(obj['mobile'].value);
            if(!(/^1[3456789]\d{9}$/.test(val))){
                $(dom).eq(2).html("请输入正确的手机号码");
                return false;
            }
            $(dom).eq(2).html("");
            return true;
        }
        function testCode(obj,dom){
            var val = $.trim(obj['code'].value);
            if(!(/^[\d]{4}$/.test(val))){
                $(dom).eq(3).html("请输入正确的验证码");
                return false;
            }
            $(dom).eq(3).html("");
            return true;
        }
        // 发送验证码
        function sendCode(mobile,callBack){
            $.ajax({
                url: apiUrl + "/homepage/register/send",
                type: "POST",
                data:{
                    mobile:mobile
                },
                success: function(data, code, xhr){
                    callBack(data);
                },
                error: function(data, errType, err){
                    callBack(data);
                }
            });
        }
        //提交 
        function submit(param,callBack){
            $.ajax({
                url: apiUrl + "/homepage/add/leads",
                type: "POST",
                data:param,
                success: function(data, code, xhr){
                    callBack(data);
                },
                error: function(data, errType, err){
                    callBack(data);
                }
            });
        }
        // form提交会刷新页面
        $("#submit").on('click',function(e){
            if(testCompany(formVal,dom)&&testName(formVal,dom)&&testPhone(formVal,dom)&&testCode(formVal,dom)){
                // 二维码进来取source
                var source = "",arr = window.location.href.split("?");
                if(arr.length>1){
                    source = arr[arr.length-1].split("=")[1];
                }
                var param = {
                    mobile:$.trim(formVal['mobile'].value),
                    code:$.trim(formVal['code'].value),
                    company_name:$.trim(formVal['company'].value),
                    user_name:$.trim(formVal['name'].value),
                    source:source?source:'123'
                }
                submit(param,function(res){
                    $(".formCon").css({display:"none"});
                    $(".success").css({display:"block"});
                    if(res.code === 0){
                        formVal.reset();
                        clearInterval(timer);
                        $('#freeCode').html('<a href="javascript:;">获取验证码</a>');
                    }
                })
            }
        })
        $("#registerForm .form-item input").eq(0).on('blur',function(){
            testCompany(formVal,dom);
        })
        $("#registerForm .form-item input").eq(1).on('blur',function(){
            testName(formVal,dom);
        })
        // 发送验证码
        $('#freeCode').on('click', function () {
            if(testPhone(formVal,dom)) {
                var mobile = $.trim(formVal['mobile'].value);
                sendCode(mobile,function(res){
                    if(res.code === 0){
                        var sec = 90;
                        $('#freeCode').text(sec + "s后重新获取");
                        timer = setInterval(function(){
                            sec--;
                            $('#freeCode').text(sec + "s后重新获取");
                            if(sec == 0){
                                clearInterval(timer);
                                $('#freeCode').html('<a href="javascript:;">获取验证码</a>');
                            }
                        },1000);
                    }else{
                        alert(res.msg)
                    }
                });
            }else{
                $(dom).eq(2).html('请输入正确的手机号码');
            }
        });
        $(".register").bind('click', function(){
            $(".sigin").addClass("showSigin");
            $("body").css({"overflow":"hidden"});
            $("#mask").css({display:"block"});
            $(".success").css({display:"none"});
            $(".formCon").css({display:"block"});
        });
        $("#close").bind('click', function(){
            $("#mask").css({display:"none"});
            $("body").css({"overflow":"auto"});
            $('.sigin').removeClass('showSigin');
        });
        // 拨打电话
        $("aside").bind("click",function(){
            var name = $(this).attr("class");
            if(!name){
                $(this).addClass("aside_active");
            }else{
                $(this).removeClass("aside_active")
            }
        })
        $(".menu").bind("click",function(){
            var name = $(".menu_list").attr("class");
            if(~name.indexOf('menu_list_show')){
                $(".menu_list").removeClass("menu_list_show");
            }else{
                $(".menu_list").addClass("menu_list_show");
            }
        })
})()