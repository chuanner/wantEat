$(function() {
			/*=========表单验证=========*/
			+

			function($) {
				//验证规则
				var checkRules = {
						"shopName": /[\u4e00-\u9fa5]{1,}/,
						"name": /[\u4e00-\u9fa5]{1,}/,
						"phone": /^1[34578]\d{9}$/,
						"vCode": /^[0-9]{6}$/,
						"ID":/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
						"normal":/\w/
					}
					//验证结果
				var checkResult;
				//封装验证结果函数
				function checkFn($this, type) {
					if($this.attr("check-type") == "blank") {
						checkResult = true;
					} else {
						checkResult = checkRules[$this.attr(type)].test($this.val());
					}
				}
				//输入时的验证
				$(".globel-ipt").on("input", function() {
						checkFn($(this), "check-type");
						if($(this).val() != "" && checkResult) {
							$(this).parent().parent().removeClass("weui-cell_warn");
							console.log("输入验证-通过");
						}
					})
					//失焦时的验证
				$(".globel-ipt").blur(function() {
						checkFn($(this), "check-type");
						console.log("失焦验证");
						if($(this).val() == "" || !checkResult) {
							$(this).parent().parent().addClass("weui-cell_warn");
						}
					})
					//提交表单时的验证
				$("#form-2").submit(function(event) {
					$(".globel-ipt").each(function(i) {
						checkFn($(this), "check-type");
						//输入框为空时，弹出提示
						if($(this).val() == "") {
							console.log("提交-输入框为空");
							$(".alert").css({
								display: "block"
							})
							$(".alert-content").html($(this).attr("placeholder"));
							event.preventDefault();
							return false;
						} else if(!checkResult) {
							console.log("提交-格式错误");
							$(".alert").css({
								display: "block"
							})
							$(".alert-content").html($(this).attr("check-msg"));
							event.preventDefault();
							return false;
						}
//						if($(this).val() != "") {
//							//验证是否上传图片
//							$(".license-box").each(function(i) {
//								if($(this).children().hasClass("jiahao2")) {
//									$(".alert").css({
//										display: "block"
//									});
//									$(".alert-content").html($(this).attr("pic-msg"));
//									event.preventDefault();
//									return false;
//								}
//							});
//						}
					});
				});

				//发送验证码
				 $(".globel-hqyzm").click(function() {
				 	checkFn($("#tel-1"), "check-type");
				 	if($("#tel-1").val() !=""&&checkResult) {
				 		console.log("可以发送验证码");
				 		function count(n, $target) {
				 			if(n >= 0) {
				 				$target.css({
				 					background: "#ccc",
				 					pointerEvents: "none"
				 				});
				 				//验证码倒计时
				 				$target.val(n + ' 秒后重发');
				 				setTimeout(function() {
				 					count(--n, $target);
				 				}, 1000);
				 			} else {
				 				$target.css({
				 					background: "#49A57B",
				 					pointerEvents: "auto"
				 				});
				 				$target.val('获取验证码');
				 			}
				 		}
				 		count(60, $(this));
				 	}
				 });
				
				//点击确定，消除弹框
				$(".alert-btn").click(function() {
					$(".alert").css({
						display: "none"
					})
				})
			}(window.jQuery)
			
			//checkbox
			+ function($) {
				var bol = true;
				$(".choose").on("click", function() {
					if(bol) {
						$(this).addClass("gou");
						$("#checkHidden").attr("checked","checked");
						$("#submit").removeClass("back-color-gray").removeAttr("disabled");
						bol = false;
					} else {
						$(this).removeClass("gou");
						$("#checkHidden").removeAttr("checked");
						$("#submit").addClass("back-color-gray").attr("disabled","disabled");
						bol = true;
					}
				})
			}(window.jQuery);
		});
		


