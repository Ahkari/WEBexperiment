/* 全局状态值 */
var beforeValue;//按键事件触发前的input值
var currentValue;//按键事件触发后的input值

$('#textareaInput').keydown(function(event){
	beforeValue = $('#textareaInput').val();//触发前的值

	$(this).width(textWidth($(this).val()));//自适应宽度,需要加的地方其一	
});

$('#textareaInput').keyup(function(event){
	var $input = $(event.currentTarget);//当前input 
    var code = event.which;//当前键值
    currentValue = $('#textareaInput').val();//当前input值
	//var blockWord = /@\w+\|/ ;//正则匹配@开头 |结尾的数字与字符
	var blockWord = /@[\u4E00-\u9FA5A-Za-z0-9_]+\|/ ;//匹配数字英文和中文

	$(this).width(textWidth($(this).val()));//自适应宽度,需要加的地方其二

	if(blockWord.test(currentValue) === true ){ //正则匹配时开始操作
		var inputResult = blockWord.exec(currentValue); //匹配的第一个值(按逻辑当前只有一个)
		var searchResult = inputResult[0].slice(1,inputResult[0].length-1); //匹配的值
		var indexDivision = blockWord.exec(currentValue).index; //开始匹配的位置
		var commonResult = blockWord.exec(currentValue).input.slice(0,indexDivision) ; //在匹配之前的正常字符们
		var commonResultAfter = blockWord.exec(currentValue).input.slice(indexDivision+inputResult[0].length) ; //在匹配之后的正常字符,检测到终止符时将他们放入下一个input框中
		
		//console.log(commonResultAfter);
		// console.log(blockWord.exec(currentValue));//当前正则匹配结果
		// console.log(inputResult);	//@word|
		// console.log(searchResult);	//word
		// console.log(commonResult);	//@前面的值

		if (commonResult!==''){ //如果存在普通字符
			var commonDomText = "<span id='domText"+$('#textDomFlag').val()+"' class='commonWrod'>"+commonResult+"</span>";//正常字符dom元素
			$('#textDomFlag').val(parseInt($('#textDomFlag').val())+1);//全局值+1
			$input.data('id',$input.data('id')+1);//input数值加1
			$input.before(commonDomText);//普通字符插入

		}

		var blockDomText = "<span id='domText"+$('#textDomFlag').val()+"' class='blockWrod'>"+inputResult+"</span>";//块状字符dom元素
		$('#textDomFlag').val(parseInt($('#textDomFlag').val())+1);//全局值+1
		$input.data('id',$input.data('id')+1);//input数值加1
		$input.before(blockDomText) ;//块状字符插入
		$input.val(commonResultAfter); //当前输入框为终止符之后的值


		/*
			这里写ajax请求inputResult匹配结果的事件
		*/
	}

	// console.log(code);	//键值
	if (code===8){	//键值为8,代表用户按下了Backspace键
		//if (currentValue==''){//当前input里面为空,那么就要删id-1的span元素中的东西了
		if (getPositionForInput($input[0])===0 && beforeValue===currentValue){//当前input中光标在0处,且Backspace之后input没变化(即在input开始处按了Backspace,就要开始对前一个元素进行删除操作了)
			var currId = $input.data('id');//获取当前input位置计数
			var willEditId = currId-1;//需要修改的是前一个元素,获取id
			if ($('#domText'+willEditId).hasClass('blockWrod')){//前一个元素是块文本
				$('#domText'+willEditId).remove();//移除该元素
				$('#textDomFlag').val(parseInt($('#textDomFlag').val())-1);//全局值-1
				$input.data('id',$input.data('id')-1);//input数值减1
			}else if($('#domText'+willEditId).hasClass('commonWrod')){//前一个元素是普通文本
				var commonText = $('#domText'+willEditId).text();//获取前一个普通文本值
				var commonTextLength = commonText.length;//文本长度
				$('#domText'+willEditId).remove();//移除该span元素,准备放入input中
				$input.val(commonText.substring(0,commonTextLength-1));//input值是文本字符减一
				$(this).width(textWidth($(this).val()));//自适应宽度,需要加的地方其三
				$('#textDomFlag').val(parseInt($('#textDomFlag').val())-1);//全局值-1
				$input.data('id',$input.data('id')-1);//input数值减1
			}
		}
	}

    console.log($input.data('id'));

});


/*兼容原有数值,将原有文本转换成dom编辑模式*/
$('.wordShow').on('click',function(event){
    var $input = $('#textareaInput');
	var recentValue = $('.text').val();
	var blockWordNotGlobal = /@[\u4E00-\u9FA5A-Za-z0-9_]+\|/;//非全局正则
	var blockWord = /@[\u4E00-\u9FA5A-Za-z0-9_]+\|/g ;//匹配@数字or英文or中文|,设置全局标志g,循环匹配
	var inputResult = []; //匹配的第一个值(按逻辑当前只有一个)
	var startIndex = 0;
	var endIndex = recentValue.length; //value长度
	var idFlag = 0;//dom元素标记值
	while (blockWordNotGlobal.test(recentValue.slice(startIndex,endIndex))){
		inputResult = blockWord.exec(recentValue);
		
        //console.log(inputResult.index);
		//console.log(inputResult.input);
		//console.log(inputResult[0]);
		//console.log(inputResult.lastIndex);
		
        if (startIndex !== inputResult.index){
			var commonResult = recentValue.slice(startIndex,inputResult.index); //正常字符
			var commonDomText = "<span id='domText"+idFlag+"' class='commonWrod'>"+commonResult+"</span>";//正常字符dom元素
			idFlag++;//计数器数值加1
            $input.data('id',$input.data('id')+1);//input数值加1
			//$('#textareaWrap').append(commonDomText);//普通字符插入
			$input.before(commonDomText);//普通字符插入
		}
		
		startIndex = blockWord.lastIndex;//设置下次开始正则匹配的位置
		//console.log(startIndex);
		
		var inputResult = recentValue.slice(inputResult.index,startIndex);
		var blockDomText = "<span id='domText"+idFlag+"' class='blockWrod'>"+inputResult+"</span>";//块状字符dom元素
		idFlag++;//计数器数值加1
        $input.data('id',$input.data('id')+1);//input数值加1
		//$('#textareaWrap').append(blockDomText);//块状字符插入
		$input.before(blockDomText);//普通字符插入
		
	}
	if (startIndex !== endIndex){
		var commonResult = recentValue.slice(startIndex,endIndex); //正常字符
		var commonDomText = "<span id='domText"+idFlag+"' class='commonWrod'>"+commonResult+"</span>";//正常字符dom元素
		idFlag++;//计数器数值加1
        $input.data('id',$input.data('id')+1);//input数值加1
		//$('#textareaWrap').append(commonDomText);//普通字符插入
		$input.before(commonDomText);//普通字符插入
	}
    
    //console.log($input.data('id'));

})


/* 工具函数	*/
//单行文本框 //获取ctrl DOM元素的中光标位置
function getPositionForInput(ctrl){ 
	var CaretPos = 0; 
		if (document.selection) { // IE Support 
			ctrl.focus(); 
			var Sel = document.selection.createRange(); 
			Sel.moveStart('character', -ctrl.value.length); 
			CaretPos = Sel.text.length; 
		}else if(ctrl.selectionStart || ctrl.selectionStart == '0'){// Firefox support 
			CaretPos = ctrl.selectionStart; 
		} 
	return (CaretPos); 
} 

//获取文本宽度 //设置input在每一次输入触发keydown事件的时候宽度自适应
var textWidth = function(text){ 
    var sensor = $('<pre>'+ text +'</pre>').css({display: 'none'}); 
    $('body').append(sensor); 
    //var width = sensor.width();
    var width = (sensor.width()+10)*1.1;//总觉得有点偏差,自己偏差调整了一下
    sensor.remove(); 
    return width;
};
