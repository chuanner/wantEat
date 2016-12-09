if(window.jQuery===undefined){
    throw new Error('jin bang ti ming 3 need a jQuery version 3.0++');    
}

/*
 * weui弹窗封装
 */
+function($){
	'use strict';
	
    $.weui={};
	var modelAlert={
            model:'',
            hidden:true,
            cache:[]
        },
        modelConfirm={
            model:'',
            hidden:true,
            cache:[]
        },
        modelWarn={
            model:'',
            cache:[]
        },
        loading='',
        modelTip={
            model:'',
            hidden:true,
            cache:[]
        };
        
	// 缓存的弹窗数据处理
    function bindCache(model,cache,callback,time){
        time=time||0;
        model.on('click.blz',function(){
            setTimeout(function(){
                callback(cache[0]);
                cache.shift();
                if(cache.length<=0){
                    model.off('click.blz');
                }
            },time);
        });
    }
    
    $.weui.alert=function(obj){
        var model=modelAlert.model;
        obj=obj||{};
		obj.title=obj.title||'';
		obj.article=obj.article||'';
		if(model!==''&&model.css('display')!=='none'){
            var cache=modelAlert.cache;
               
            // 假如弹窗已存在,将弹窗数据缓存；
            cache[cache.length]=obj;
            
            model.off('click.blz');
            bindCache(model,cache,$.weui.alert,300);
            return false;
		}else if(model!==''){
            model.find('.weui_dialog_title').html(obj.title);
		    model.find('.weui_dialog_bd').html(obj.article);
		    model.fadeIn(300);
        }else{
			model='<div class="weui_dialog_alert" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999" data-blz-dismiss=".weui_dialog_alert">'+
                  '<div class="weui_mask"></div>'+
                  '<div class="weui_dialog">'+
                      '<div class="weui_dialog_hd">'+
                          '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
                      '</div>'+
                      '<div class="weui_dialog_bd">'+obj.article+'</div>'+
                      '<div class="weui_dialog_ft">'+
                          '<a href="javascript:void(0);" class="weui_btn_dialog primary" data-blz-dismiss=".weui_dialog_alert">确定</a>'+
                      '</div>'+
                  '</div>'+
                  '</div>';
			modelAlert.model=model=$(model).appendTo(document.body);
		}
        if(obj.sureCallback){
            model.find('.weui_btn_dialog').off('click.blz').one('click.blz',obj.sureCallback);
        }
		return model;
	};
    
	$.weui.confirm=function(obj){
        var model=modelConfirm.model;
        obj=obj||{};
		obj.title=obj.title||'';
		obj.article=obj.article||'';
        obj.cancelText=obj.cancelText||'取消';
        obj.sureText=obj.sureText||'确定';
        obj.sureHref=obj.sureHref||'javascript:void(0);';
        obj.cancelHref=obj.cancelHref||'javascript:void(0);';
		
        if(model!==''&&model.css('display')!=='none'){
            var cache=modelConfirm.cache;
               
            // 假如弹窗已存在,将弹窗数据缓存；
            cache[cache.length]=obj;
            
            model.off('click.blz');
            bindCache(model,cache,$.weui.confirm,300);
            return false;
        }else if(model!==''){
			model.find('.weui_dialog_title').html(obj.title);
            model.find('.weui_dialog_bd').html(obj.article);
            model.find('.weui_btn_dialog.default').html(obj.cancelText).attr('href',obj.cancelHref);
            model.find('.weui_btn_dialog.primary').html(obj.sureText).attr('href',obj.sureHref);
			model.fadeIn(300);
		}else{
			model='<div class="weui_dialog_confirm" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999" data-blz-dismiss=".weui_dialog_confirm">'+
                            '<div class="weui_mask"></div>'+
                            '<div class="weui_dialog">'+
                                '<div class="weui_dialog_hd">'+
                                    '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
                                '</div>'+
                                '<div class="weui_dialog_bd">'+obj.article+'</div>'+
                                '<div class="weui_dialog_ft">'+
                                    '<a href="'+obj.cancelHref+'" class="weui_btn_dialog default" data-blz-dismiss=".weui_dialog_confirm" data-blz-option="cancell">'+obj.cancelText+'</a>'+
                                    '<a href="'+obj.sureHref+'" class="weui_btn_dialog primary" data-blz-dismiss=".weui_dialog_confirm" data-blz-option="sure">'+obj.sureText+'</a>'+
                                '</div>'+
                            '</div>'+
                         '</div>';
			modelConfirm.model=model=$(model).appendTo(document.body);
		}
        
        
		if(obj.cancellCallback){
			$(document).off('clickBlzOptioncancell');
            $(document).one('clickBlzOptioncancell',function(e){
				obj.cancellCallback(e);
				$(document).off('clickBlzOptionsure');
			});
		}
		if(obj.sureCallback){
			$(document).off('clickBlzOptionsure');
            $(document).one('clickBlzOptionsure',function(e){
				obj.sureCallback(e);
				$(document).off('clickBlzOptioncancell');
			});
		}
        
		// 确定取消按钮
		$(document).one('click','[data-blz-option]',function(){
			var data=$(this).data('blz-option');
			setTimeout(function(){
				$(document).trigger('clickBlzOption'+data);
			},0);
		});
		return model;
	};
    
    $.weui.loading=function(string){
        if(!navigator.onLine){
            $.weui.tip('无网络');
            return false;
        }
        string=string||'数据加载中';
        if(loading!==''){
            loading.css('display','block').find('.weui_toast_content').html(string);
        }else{
            loading='<div id="loadingToast" class="weui_loading_toast" style="display: none;" data-blz-dismiss="#loadingToast">'+
                        '<div class="weui_mask_transparent"></div>'+
                        '<div class="weui_toast">'+
                            '<div class="weui_loading">'+
                                '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'+
                                '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
                            '</div>'+
                            '<p class="weui_toast_content">'+string+'</p>'+
                        '</div>'+
                    '</div>';
             loading=$(loading).appendTo(document.body).css('display','block');
        }
        return loading;
    };
    
    $.weui.warn=function(obj){
        var model=modelWarn.model;
        var cache=modelWarn.cache;
        
        obj.article=obj.article||'';
        obj.title=obj.title||'温馨提示';
        
        if(model!==''&&model.css('display')!=='none'){
               
            // 假如弹窗已存在,将弹窗数据缓存；
            cache[cache.length]=obj;
            return model;
        }else if(model!==''){
            model.html(obj.title+'：'+obj.article).fadeIn();
        }else {
            model='<div class="weui_toptips weui_warn js_tooltips">'+obj.title+'：'+obj.article+'</div>';
            modelWarn.model=model=$(model).appendTo(document.body).fadeIn();
        }
        
        setTimeout(function(){
            model.fadeOut(0);
            
            // 小于零则关闭warn弹窗的反复调用大于0则开启
            if(cache.length<0){
                $.weui.warn(cache[0]);
                cache.shift();
            }
        },3000);
        
        return model;
    };
    
    $.weui.tip=function(string){
        var model=modelTip.model;
        var cache=modelTip.cache;
        
        string=string||'';
        if(model!==''&&model.css('display')!=='none'){
               
            // 假如弹窗已存在,将弹窗数据缓存；
            cache[cache.length]=string;
            return model;
        }else if(model!==''){
            model.html(string).fadeIn();
        }else {
            model='<div class="glb_weui_toast weui_toast">'+string+'</div>';
            modelTip.model=model=$(model).appendTo(document.body);
        }
        setTimeout(function(){ 
           $(model).fadeOut(0);
           
           // 小于零则关闭tip弹窗的反复调用大于0则开启
           if(cache.lengt<0){
                $.weui.tip(cache[0]);
                cache.shift();
            }
        },3000);
        
        return model;
    };
	
    // dismiss交互
	$(document).on('click','[data-blz-dismiss]',function(){
		var target=$(this).attr('data-blz-dismiss');
		$(target).fadeOut(0);
	});
    
    // show交互
	$(document).on('click','[data-blz-show]',function(){
		var target=$(this).attr('data-blz-show');
		$(target).fadeIn(300);
	});
    
    // 清除内容交互
    $(document).on('click','[data-blz-empty]',function(){
		var target=$(this).attr('data-blz-empty');
		$(target).empty().hide();
	});
}(window.jQuery);

/*
 * blz模块声明
 */
+function($){
    'use strict';
    $.blz={};
    $.blz.emptyFunciton=function(){};
    $.blz.getDataType=function(data){
        return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
    };
    $.blz.useragent=/Android/gi.test(navigator.userAgent);
}(window.jQuery);

 
/*
 * 表单验证小孩年龄
 */
+function($){
    'use strict';
    
    $.serverTime=$.serverTime||{};
    $.blz.getAge=function(obj){
        var age=0;
        var now=new Date();
        var year=$.serverTime.year||now.getFullYear();
        var month=$.serverTime.month||now.getMonth()+1;
        var date=$.serverTime.date||now.getDate();
        obj=obj||{};
        obj.year=parseInt(obj.year)||year;
        obj.month=parseInt(obj.month)||month;
        obj.date=parseInt(obj.date)||date;
        age=year-obj.year;
        if(age<0){return age;}
        if(obj.month>month){
            age=age-1;
        }else if(obj.month===month){
            if(obj.date>date){
                age=age-1;
            }else{
                age=age+1;
            }
        }else {
            age=age+1;
        }
        return age;
    };    
}(window.jQuery);


/*
 * 表单图片上传
 */
+function($){
    'use strict';
    
    var elem=document.querySelector('input[type="file"]');
	if(!elem){return false;}
	
    // 允许上传的图片类型
    var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    
    // 图片上传大小限制10MB
    var maxSize = 10 * 1024 * 1024;
    
    // 最大上传图片数量
    var maxCount = 1;
    
    // 处理后图片的缓存
    var images = [];
    
    // 加载窗口
    var loading=$('数据加载中');
    
    $('.upload-button').on('change', function (event) {
        var files = event.target.files;

        // 如果没有选中文件，直接返回
        if (files.length === 0) {
            return;
        }
        for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i];

            // 如果类型不在允许的类型范围内
            if (allowTypes.indexOf(file.type) === -1) {
                $.weui.alert({article:'该类型不允许上传'});
                continue;
            }

            if (file.size > maxSize) {
                $.weui.alert({article:'图片太大，不允许上传'});
                continue;
            }

            if ($('.weui_uploader_file').length >= maxCount) {
                $.weui.alert({article:'最多只能上传' + maxCount + '张图片'});
                return;
            }
            loading=$.weui.loading();    
            canvasResize(file, {
                crop: false,
                quality: 100,
                //rotate: 0,
                callback: function(data,w,h) {
                    
                    // 插入到预览区
                    var $btnFile=$('.file');
                    $(loading).css('display','none');
                    $btnFile.css('background-image','url('+data+')');
                    if(w>=h){
                        $btnFile.css('background-size','100% auto');
                    }else {
                        $btnFile.css('background-size','auto 100%');
                    }
                    
                    // 存储的修改后的图片备份发后台待处理.....................
                    images.push(data);
                      
                }
            });
        }
    });
}(window.jQuery); 

/*
 * 表单验证插件
 */
+function($,getAge){
	'use strict';
    
    // 不存在表单元素直接返回
    if(!document.querySelector('form')){
        return false;
    }
    
    // 提示语
    var checkTip={
        any:'内容不能为空',
        name:'姓名格式错误',
        id:'身份证号码格式错误',
        phone:'手机号码格式错误',
        email:'邮箱格式错误',
        check:'验证码错误',
        agreement:'请同意协议',
        custom:'内容有误',
        price:'金额不能小于等于0',
        repeat:'密码输入不一致',
        childid:'孩子身份证号码格式错误',
        address:'省市区不能为空'
    };
    
    // 检验规则
	var checkRule={
		any:[[1,100]],
		name:[[2,15],'[\u4e00-\u9fa5]{1,}(·?)[\u4e00-\u9fa5]{1,}$'],
		id:[[15,18],false,function(val){
			var Validator = new IDValidator();
			return Validator.isValid(val)&&getAge({
                    year:val.slice(6,10),
                    month:val.slice(10,12),
                    date:val.slice(12,14)
                })>0;
		}],
		phone:[[11,11],'^1'],
		email:[[4,30],'^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$'],
		check:[[6,6],false,function(val){
			return val===($(this).attr('data-blz-pattern')?$(this).attr('data-blz-pattern').toString():val);
		}],
		agreement:[false,false,function(){
			return $(this).prop('checked');
		}],
		custom:[false,false,function(val){
			return val!==($(this).attr('data-blz-pattern')?$(this).attr('data-blz-pattern').toString():val+'1');
		}],
        price:[false,false,function(val){
            return val>0;
        }],
        repeat:[false,false,function(val){
            return val===$($(this).attr('data-blz-same')).val();
        }],
        childid:[[18,18],false,function(val){
			var Validator = new IDValidator();
            var obj={
                    year:val.slice(6,10),
                    month:val.slice(10,12),
                    date:val.slice(12,14)
                };
			return Validator.isValid(val)&&getAge(obj)>0&&obj.year>=2010;
		}],
        address:[false,false,function(){
            return $(this).val()!=='';
        }],
		lengthcustom:[[6,6]]
	};
    
    $.blz.checkRule=checkRule;
    
    // 检查表单值是否合法函数
    function check(event) {
        var $this=$(this);
        var val=$this.val();
        var type=$this.attr('data-blz-type').toLowerCase();
        var rule = false;
        var $elem=$($this.closest('.weui_cell'));
        var tipLength=false;
        var customs=false;
        if(checkRule[type][0]){
            tipLength = val.length < checkRule[type][0][0] || val.length > checkRule[type][0][1];
        }
        if(checkRule[type][1]){
            rule = new RegExp( checkRule[type][1], 'g');
            rule=!rule.test($.trim(val));
        }
        if(checkRule[type][2]&&(type!=='check'?true:event?true:false)){
            customs=!checkRule[type][2].call($this,$.trim(val));
        }
        
        // 输入非法验证
        if (rule||tipLength||customs) { 
            $elem.addClass('weui_cell_warn');
            
            // 对于非法输入开启自动验证
            if($this.attr('data-blz-auto-check')!=='yes'){
                $this.attr('data-blz-auto-check','yes');
                setInterval(function(){
                    check.call($this);
                },800);
            }
            if(event){
                $.weui.tip($this.attr('data-blz-alert')||checkTip[type]);
            }
            
            $this.attr('data-blz-check','inpass');
        } else { 
            
            // 输入合法验证
            $elem.removeClass('weui_cell_warn');
            $this.attr('data-blz-check','pass');
        }
    }
	
	$.blz.checkFn=check;
    
    // 核心检验函数
	$.fn.check = function(obj) {
        obj=obj||{};
        obj.getVerificationCode=obj.getVerificationCode||$.blz.emptyFunciton;
        obj.canSubmit=obj.canSubmit||$.blz.emptyFunciton;
        
		if(this.length<=0){return false;}
		var $elems = [this.eq(0).find('[data-blz-type]')]; // 获取要验证的表单元素
		var isCountStart=false;
		$.blz.checkElems=$elems;
        // 计数器函数
		function count(n,$target){
			if(n>=0){
				isCountStart=true;
				$target.addClass('grey');
				$target.find('input').val(n+' 秒');
				setTimeout(function(){
					count(--n,$target);
				},1000);
			}else {
				$target.removeClass('grey');
				$target.find('input').val('获取验证码');
				isCountStart=false;
			}
		}
		$('#mf-btn-send').off('click.sendMessage');
		$('#mf-btn-send').on('click.sendMessage',function(){
            if(isCountStart){return false;}
            var $target=$($(this).attr('data-blz-target'));
			if($target.val().length===11&&$target.val()[0]==='1'){
				obj.getVerificationCode($('input[data-blz-type="check"]'));
			}else{
			    //$target.closest('.weui_cell').addClass('weui_cell_warn');
//                $.weui.tip('手机号码格式错误');
//                $target.attr('data-blz-auto-check','yes');
//                setInterval(function(){
//                    check.call($target);
//                },500);
                return false;	
			}
			count(45,$(this));
		});
        
        // 协议
        $('#glb-agreement').off('change');
        $('#glb-agreement').on('change',function(){
            if(this.checked){
                $('input[type="submit"]').removeClass('disabled').prop('disabled',false);
            }else {
                $('input[type="submit"]').addClass('disabled').prop('disabled',true);
            }
        });
        
		// 失去焦点时验证
        $elems[0].off('blur.blz blurSimulation');
        $elems[0].on('blur.blz blurSimulation',function(e){
            check.call(e.target);
        });
        
        this.eq(0).off('submit.blz');
		this.eq(0).on('submit.blz',function(event){
            var $this=$(this);
            var i=0;
            var elemCheck=$this.find('[data-blz-type="check"]');
            
            // 依据检测合法的表单元素个数是否等于要验证的表单元素个数来决定是否提交表单； 
			if($this.find('[data-blz-check="pass"]').length!==$this.find('[data-blz-type]').length){
                event.preventDefault();
                for(i=0;i<$elems[0].length;i++){
                    check.call($elems[0][i],event);
                    if($elems[0].eq(i).attr('data-blz-check')!=='pass'){
                        $elems[0][i].scrollIntoViewIfNeeded();
						setTimeout(function(){$elems[0].eq(i).trigger('inPass');},0);
                        break;
                    }
                }
                return false;
            }else if(elemCheck.length!==0){
				
				// 针对验证码的检测
                check.call(elemCheck,event);
                if(elemCheck.attr('data-blz-check')!=='pass'){
                    elemCheck[0].scrollIntoViewIfNeeded();
                    event.preventDefault();
                    return false;
                }
            }
            
            obj.canSubmit(event);
		});
        
		return this;
	};
	
    $.fn.offCheck=function(){
        this.eq(0).off('submit.blz');
    };
    
    // 启用表单验证
    $('.model-form').attr('novalidate',false).check();
    $('.glb-form').attr('novalidate',false).check();
    
	//安卓bug修复
	if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        });
    }
}(window.jQuery,window.jQuery.blz.getAge);


/*
 * 表单响应go按键主动提交
 */
 +function($){
    'use strict';
    
    $(document).on('keyup',function(e){
        if(e.which===13){
            $('form').submit();
        }
    }); 
 }(window.jQuery);
 
/*
 * 条款交互
 */
+function($){
	'use strict';
    
    if(document.querySelector('[data-blz-pdf]')===null){return false;}
    var html='<div class="weui_mask" id="glb_weui_mask" data-blz-dismiss="#glb_weui_mask">'+
					'<span class="close"></span>'+
					'<div id="wrapper" style="position:absolute;top:0; left:0;right:0;bottom:0;">'+
						'<ul>'+
							'<li id="img-box">'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>';
	// 预加载
	$.blz.cache=[];
	var $pdf=$('[data-blz-pdf]');
	for(var i=0; i<$pdf.length;i++){
		var datas=$pdf.eq(i).data('blz-pdf');
		var data=datas.split(' ');
		var length=data.length;
		for(var j=0;i<length;i++){
			var img=new Image();
			img.src=data[j];
			$.blz.cache[$.blz.cache.length]=img;
		}
	}
	$(document).on('click','[data-blz-pdf]',function(event){
		event.preventDefault();
        var loading=$.weui.loading();
		var datas=$(this).data('blz-pdf');
		var data=datas.split(' ');
		var length=data.length;
		var a=[];
		
		if(html!==null){
			$(html).appendTo(document.body);
			html=null;
		}		
        $('#wrapper').html('<ul><li id="img-box"></li></ul>');
		for(var i=0;i<length;i++){
			var img=new Image();
			img.onload=function(){
				a[a.length]=this;
				length--;
				if(length<=0){
					for(var i=0; i<a.length;i++){
						$(a[i]).appendTo($('#img-box'));
					}
                    $(loading).css('display','none');
					$('#glb_weui_mask').show();
					var myScroll = new IScroll('#wrapper', {
						scrollbars: true,
						mouseWheel: true,
						interactiveScrollbars: true,
						shrinkScrollbars: 'scale',
						fadeScrollbars: true
					});
				}
			};
			img.src=data[i];
			
		}
	});
	$('#glb_weui_mask').on('click',function(){
		$(this).hide();
	});
}(window.jQuery||window.Zepto);



/*
 * 键盘
 */
+function($){
    'use strict';
    
    if($('.glb-keyboard').length<=0){return false;}
    
    var $keyboard=$('.glb-keyboard');
    var $sync={
        length:0,
        elems:null,
        selector:''};
    var $targetInput=$('哈哈');
    var $targetTwinkle=$('哈哈');
    var $targetElem=$('哈哈');
    var $Inputs=$('[data-blz-keyboard="true"][data-blz-input="true"]').find('input');
    var $targetInputPrev=$targetInput;
    
    // 获取window高度
    var h1=window.innerHeight;
    var h2=h1;
    
    // 是否可以提交
    function canSubmit($elem){
        var a=false;
        for(var i=0;i<$Inputs.length;i++){
            if($Inputs.eq(i).val()<=0){
                a=false;
                break;
            }else {
                a=true;
            }
        }
        if(a){
            $elem.closest('.glb-keyboard').addClass('glb-submit-available');
        }else {
            $elem.closest('.glb-keyboard').removeClass('glb-submit-available');
        }
    }
    
    //金额美化函数
    function lookBetter(val){
        if(val===''){return '';}
        val=val.toString();
        var betterVal='';
        var a=[];
        var index=val.indexOf('.');
        var l=parseInt(val).toString().length;
        for(var i=l;i>=3;i-=3){
            a[a.length]=val.slice(i-3,i);
        }
        if(l%3!==0){
            a[a.length]=val.slice(0,l%3);
        }
        for(i=a.length-1;i>0;i--){
            betterVal+=a[i]+',';
        }
        betterVal+=a[0];
        if(index!==-1){
            betterVal+=val.slice(index,val.length);
        }
        return betterVal;
    }
    
    // input值键入时自身属性检测
    function toMyValue(val,$target,tip){
        var index=-1;
        if($target.data('blz-max')){
            val=val<=$target.data('blz-max')?val:$target.data('blz-max').toString();
        }
        if($target.data('blz-min')){
            val=val>=$target.data('blz-min')?val:$target.data('blz-min').toString();
        }
        if($target.data('blz-sync-map')&&tip){
            val=val*$target.data('blz-sync-map');
            val=''+val;
        }
        if($target.data('blz-tofixed')&&val.indexOf('.')!==-1&&val.length-val.indexOf('.')>$target.data('blz-tofixed')){
            index=val.indexOf('.');
            val=val.slice(0,index+3);
        }
        
        return val;
    }
    
    // 模拟键盘输入
    function input($elem,$target){
        var val=$target.val();
        var text=$elem.text();
        var val1='';
        if(!isNaN(parseInt(text))){
            if(val.length===1&&val==='0'){
                val=text;
            }else{
                val=val+text;
            }
            
        }else if(text==='.'){
            if(val.indexOf('.')===-1&&val.length>0){
                val=val+'.';
            }
        }else if($elem.is('.glb-keyb-delete')){
            val=val.slice(0,-1);
        }else if($elem.is('.glb-keyb-confirm')&&$elem.closest('.glb-keyboard').is('glb-submit-available')){
            $target.closest('form').trigger('submit');
            return false;
        }else {
            return false;
        }
        val=toMyValue(val,$target,false);
        $target.val(val);
        val1=lookBetter(val);
        if($sync.length!==0&&$sync.selector===$target.data('blz-sync')){
            $sync.elems.each(function(index, element) {
                if('value' in element){
                    element.value=toMyValue(val,$(element),true);
                    if($(element).data('blz-sync')){
                        setTimeout(function(){
                            $(element).trigger('blzChangeBindData');
                        },0);
                    }
                }else{
                    element.textContent=val1;
                }
            });
        }
        
        // canSubmit($elem);
        setTimeout(function(){
            $target.trigger('blzkeyup');
        },0);
    }
    
    // 模拟提交事件
    $('.glb-keyb-confirm').on('click.submit',function(){
        if($(this).closest('table').is('.glb-submit-available')){
            setTimeout(function(){
                $('form').trigger('submit');
            },0);
        }
    });
    
    $(document).on('click','[data-blz-keyboard-submit]',function(){
        setTimeout(function(){
            $('.glb-keyb-confirm').trigger('click.submit');
        },0);
    });
    
    // 被动触发数据互联，互动
    $(document).on('blzChangeBindData',function(e){
        var $target=$($(e.target).data('blz-sync'));
        var val=e.target.value;
        var val1=lookBetter(val);
        $target.each(function(index, element) {
            if('value' in element){
                element.value=toMyValue(val,$(element),true);
            }else{
                element.textContent=val1;
            }
        });
    });
    
    // 当点击带有data-blz-keyboard的元素聚焦时弹出此键盘，并显示光标
    // 失去焦点时，隐藏键盘，光标
    $(document).on('click.blz.keyboard',function(event){
        
        $targetElem=$(event.target).closest('[data-blz-keyboard]');
        
        // 根据h2的高度来决定程序是否继续执行
        if(h2<h1){return false;}
        
        if($targetElem.is('[data-blz-keyboard="true"][data-blz-input="true"]')){
            $targetTwinkle.removeClass('glb-show').addClass('glb-hide');
            $targetInput=$targetElem.is('input')?$targetElem:$targetElem.find('input[readonly]');
            
            // blur focus事件模拟
            if($targetInputPrev[0]!==$targetInput[0]){
               setTimeout(function(){
                   $targetInputPrev.trigger('blurSimulation');
                   $targetInput.trigger('focusSimulation');
                   $targetInputPrev=$targetInput;
               },0);         
            }
            
            if($targetInput.data('blz-sync')){
                $sync.elems=$($targetInput.data('blz-sync'));
                $sync.length=$sync.elems.length;
                $sync.selector=$targetInput.data('blz-sync');
            }
            $targetTwinkle=$targetElem.closest('.weui_cell').find('.glb-twinkle').addClass('glb-show').removeClass('glb-hide');
            $keyboard.addClass('glb-slide-up').removeClass('glb-slide-below')
                     .off('click')
                     .on('click','td',function(){
                         input($(this),$targetInput); 
                     });
        }else if($targetElem.length===0||$targetElem.is('[data-blz-keyboard="false"]')){
            $targetTwinkle.removeClass('glb-show').addClass('glb-hide');
            $keyboard.addClass('glb-slide-below').removeClass('glb-slide-up').off('click');
            setTimeout(function(){
                $targetInputPrev.trigger('blurSimulation');
                $targetInputPrev=$('空元素');
            },0);
        }
    });
    
    // resize ios下原生键盘弹出不会触发resize事件而安卓则会，此事件只针对安卓
    if($.blz.useragent){
        $(window).on('resize',function(){
            h2=window.innerHeight;
            $('#text').text(h2);
            if(h2>=h1){
                setTimeout(function(){
                    $targetElem.trigger('click.blz.keyboard');
                },0);
            }
        });   
    }
   
   // 呼起模拟键盘
   if(window.innerHeight>=480){
        $Inputs.eq(0).trigger('click'); 
   }
}(window.jQuery);

/*
 * tab选项卡
 */
+function($){
   'use strict';

   var elemTab=document.querySelector('.model-tab');
   if(!elemTab){return false;}
   
   var swiper=$(elemTab).data('blzSwiper');
   $(elemTab).on('click','.item',function(){
   		$(this).addClass('active').siblings().removeClass('active');
		swiper.slideTo($(this).data('blz-index')-1);
   });
}(window.jQuery);

/*
 * 页面交互bug修复
 */
document.body.addEventListener('touchstart',function(){},false);

/*
 * 下拉列表交互
 */
+function($,$elems,check){
	'use strict';
	
	var elem=document.querySelector('.weui_check');
	if(!elem){return false;}
	
	$('.model-form').on('change','.weui_check',function(){
		if(this.checked){
			$(this).closest('.weui_cell').addClass('active').next('.inside').slideDown(300).find('.weui_select').attr({
					'data-blz-type':'custom',
					'data-blz-pattern':'请选择金额'
				}).on('blur.blz blurSimulation',function(e){
					check.call(e.target);
				});	
				$elems[0]=$('.model-form [data-blz-type]');
		}else {
			$(this).closest('.weui_cell').removeClass('active').next('.inside').slideUp(300).find('.weui_select').removeAttr('data-blz-type data-blz-pattern').off('blur.blz blurSimulation');
			$elems[0]=$('.model-form [data-blz-type]');
		}
	});
}(window.jQuery,$.blz.checkElems,$.blz.checkFn);

/*
 * 下拉列表交互2
 */
+function($){
	'use strict';
	
	var elem=document.querySelector('.drop-down');
	if(!elem){return false;}
	$(document).on('click.dropDown','.drop-down',function(){
		if($(this).is('.active')){
			$(this).removeClass('active').next('.inside').slideUp(300);
		}else{
			$(this).addClass('active').next('.inside').slideDown(300);
		}
	});
	
}(window.jQuery); 


/*
 * 车险未来付实名认证
 */
+function($){
	'use strict';
	
	var elem=document.querySelector('.model-authentication');
	if(!elem){return false;}
	
	$(elem).on('change','input[type="radio"]',function(){
		if(this.checked){
			$(this).closest('.item').addClass('active').siblings('.item').removeClass('active');
		}
		$('input[type="submit"]').prop('disabled',false).removeClass('disabled');
	});
	
}(window.jQuery);  