/* 全局状态值 */
var beforeValue;//按键事件触发前的input值
var currentValue;//按键事件触发后的input值
var idFlag = 0;






var bindTextareaInputkeyEvent = function(){
    /*键入事件*/
    //子事件: 检测键盘事件前input的值,为了Backspace事件做判断

    $('#textareaInput').keydown(function(event){
        //beforeValue = $('#textareaInput').val();//触发前的值
        beforeValue = $('#textareaInput').html();//触发前的值
        //$(this).width(textWidth($(this).val()));//自适应宽度,需要加的地方其一    
    });

    /*键出事件*/
    //子事件: 检测终止符,块化元素
    //检测Backspace,删除退格键之前的块状元素或内容
    $('#textareaInput').keyup(function(event){
        var $input = $(event.currentTarget);//当前input 
        var code = event.which;//当前键值
        //console.log(code);
        //currentValue = $('#textareaInput').val();//当前input值
        currentValue = $('#textareaInput').html();//当前input值
        //var blockWord = /@\w+\|/ ;//正则匹配@开头 |结尾的数字与字符
        // /[@&$!|][\u4E00-\u9FA5A-Za-z0-9_]+\s/g 
        //var blockWord = /@[\u4E00-\u9FA5A-Za-z0-9_]+\|/ ;//匹配数字英文和中文
        //var blockWord = /@[\u4E00-\u9FA5A-Za-z0-9_]+[@&$!|\s]/ ;//匹配数字英文和中文
        var blockWord = /[@$][^@&$!|\s]+[@&$!|\s]/ ;//匹配非@ & $ ! 空格以外的所有东西

        //$(this).width(textWidth($(this).val()));//自适应宽度,需要加的地方其二

        if(blockWord.test(currentValue) === true ){ //正则匹配时开始操作
            var inputResult = blockWord.exec(currentValue); //匹配的第一个值(按逻辑当前只有一个),数组
                //inputResult = inputResult.subString(0,inputResult.length-1); //要变成块状的部分
            var searchResult = inputResult[0].slice(1,inputResult[0].length-1); //匹配的值
            var indexDivision = blockWord.exec(currentValue).index; //开始匹配的位置
            var commonResult = blockWord.exec(currentValue).input.slice(0,indexDivision) ; //在匹配之前的正常字符们
            var commonResultAfter = blockWord.exec(currentValue).input.slice(indexDivision+inputResult[0].length-1) ; //在匹配之后的正常字符,检测到终止符时将他们放入下一个input框中
            
            //console.log(commonResultAfter);
            // console.log(blockWord.exec(currentValue));//当前正则匹配结果
            // console.log(inputResult);    //@word|
            // console.log(searchResult);   //word
            // console.log(commonResult);   //@前面的值

            if (commonResult!==''){ //如果存在普通字符
                var commonDomText = "<span id='domText"+$('#textDomFlag').val()+"' class='commonWrod' onclick='editDomText(event)'>"+commonResult+"</span>";//正常字符dom元素
                //$('#textDomFlag').val(parseInt($('#textDomFlag').val())+1);//全局值+1
                //$input.data('id',$input.data('id')+1);//input数值加1
                $input.before(commonDomText);//普通字符插入

            }
            if (inputResult[0].charAt(inputResult[0].length-1) !== ' '){ //终止符不为空格,光标设在第二个字符处
                var blockDomText = "<span id='domText"+$('#textDomFlag').val()+"' class='blockWrod'>"+inputResult[0].substring(0,inputResult[0].length-1)+"</span>";//块状字符dom元素
                //$('#textDomFlag').val(parseInt($('#textDomFlag').val())+1);//全局值+1
                //$input.data('id',$input.data('id')+1);//input数值加1
                $input.before(blockDomText) ;//块状字符插入
                //$input.val(commonResultAfter); //当前输入框为终止符之后的值
                $input.html(commonResultAfter); //当前输入框为终止符之后的值
                if (inputResult[0].charAt(inputResult[0].length-1) === ' '){
                    //$input.val($input.val().substr(1));
                    $input.html($input.html().substr(1));
                    setCursorPosition($input[0],0);//设置光标位置,在空格之前

                }else{
                    setCursorPosition($input[0],1);//设置光标位置,在终止(起始符)之后
                }
            }    
            else{//终止符是空格
                var blockDomText = "<span id='domText"+$('#textDomFlag').val()+"' class='blockWrod'>"+inputResult[0].substring(0,inputResult[0].length)+"</span>";//块状字符dom元素
                $input.before(blockDomText) ;//块状字符插入
                $input.html(commonResultAfter);

            }

            /*
                这里写ajax请求inputResult匹配结果的事件
            */
        }

        // console.log(code);   //键值
        if (code===8){  //键值为8,代表用户按下了Backspace键
            //if (currentValue==''){//当前input里面为空,那么就要删id-1的span元素中的东西了
            if (getPositionForInput($input[0])===0 && beforeValue===currentValue){//当前input中光标在0处,且Backspace之后input没变化(即在input开始处按了Backspace,就要开始对前一个元素进行删除操作了)
                //var currId = $input.data('id');//获取当前input位置计数
                //var willEditId = currId-1;//需要修改的是前一个元素,获取id
                //console.log($input.prev('span'));
                if ($input.prev('span').hasClass('blockWrod')){//前一个元素是块文本
                    $input.prev('span').remove();
                    //$('#domText'+willEditId).remove();//移除该元素
                    //$('#textDomFlag').val(parseInt($('#textDomFlag').val())-1);//全局值-1
                    //$input.data('id',$input.data('id')-1);//input数值减1
                }else if($input.prev('span').hasClass('commonWrod')){//前一个元素是普通文本
                    var commonText = $input.prev('span').text();//获取前一个普通文本值
                    var commonTextLength = commonText.length;//文本长度
                    $input.prev('span').remove();//移除该span元素,准备放入input中
                    //$input.val(commonText.substring(0,commonTextLength-1)+currentValue);//input值是文本字符减一
                    $input.html(commonText.substring(0,commonTextLength-1)+currentValue);//input值是文本字符减一
                    //$(this).width(textWidth($(this).val()));//自适应宽度,需要加的地方其三
                    //setCursorPosition($input[0], commonTextLength-1);//设置光标位置
                    cursorMoveEnd($input[0]);//光标移到该文本结尾-1处
                    //$('#textDomFlag').val(parseInt($('#textDomFlag').val())-1);//全局值-1
                    //$input.data('id',$input.data('id')-1);//input数值减1
                }
            }
        }

        //console.log($input.data('id'));

    });
}

bindTextareaInputkeyEvent();


/*点击普通文本编辑事件*/
//正在编辑的input变为普通块状,点击的普通块状变为input
function editDomText(event){
    var $editTarget = $(event.currentTarget);

    //var commonText = $('#textareaInput').val();
    var commonText = $('#textareaInput').html();
    var commonDomText = "<span id='domText"+idFlag+"' class='commonWrod' onclick='editDomText(event)'>"+commonText+"</span>";//正常字符dom元素
    

    $('#textareaInput').after(commonDomText);
    $('#textareaInput').remove();

    //;var inputDomText = "<input id='textareaInput' data-id='0' value='"+$editTarget.html()+"' />";
    var inputDomText = "<div id='textareaInput' contenteditable style='display:inline-block'>"+$editTarget.html()+"</div>";//input换成富文本div
    $editTarget.after(inputDomText);
    $editTarget.remove();

    $('#textareaInput').focus();
    //$('#textareaInput').width(textWidth($('#textareaInput').val()));//自适应宽度,需要加的地方其一    

    bindTextareaInputkeyEvent();
}

/*兼容原有数值,将原有文本转换成dom编辑模式*/
$('.wordShow').on('click',function(event){
    var $input = $('#textareaInput');
    var recentValue = $('.text').val();
    //var blockWordNotGlobal = /@[\u4E00-\u9FA5A-Za-z0-9_]+\|/;//非全局正则
    //var blockWord = /@[\u4E00-\u9FA5A-Za-z0-9_]+\|/g ;//匹配@数字or英文or中文|,设置全局标志g,循环匹配
    var blockWordNotGlobal = /[@$][^@&$!|\s]+[@&$!|\s]/ ;//匹配非@ & $ ! 空格以外的所有东西,非全局
    var blockWord = /[@$][^@&$!|\s]+[@&$!|\s]/g ;//匹配非@ & $ ! 空格以外的所有东西
    var inputResult = []; //匹配的第一个值(按逻辑当前只有一个)
    var startIndex = 0;
    var endIndex = recentValue.length; //value长度
    //var idFlag = 0;//dom元素标记值
    while (blockWordNotGlobal.test(recentValue.slice(startIndex,endIndex))){

        inputResult = blockWord.exec(recentValue);

        if (inputResult[0].charAt(inputResult[0].length-1) !== ' '){ //终止符不为空格
                   
            //console.log(inputResult.index);
            //console.log(inputResult.input);
            //console.log(inputResult[0]);
            //console.log(inputResult.lastIndex);
            
            if (startIndex !== inputResult.index){
                var commonResult = recentValue.slice(startIndex,inputResult.index); //正常字符
                var commonDomText = "<span id='domText"+idFlag+"' class='commonWrod' onclick='editDomText(event)'>"+commonResult+"</span>";//正常字符dom元素
                //idFlag++;//计数器数值加1
                //$input.data('id',$input.data('id')+1);//input数值加1
                //$('#textareaWrap').append(commonDomText);//普通字符插入
                $input.before(commonDomText);//普通字符插入
            }
            
            startIndex = blockWord.lastIndex-1;//设置下次开始正则匹配的位置
            blockWord.lastIndex--; //然而exec的正则自带index也要对应减一,不然检测不出紧邻的起始符
            //console.log(startIndex);
            
            var inputResult = recentValue.slice(inputResult.index,startIndex);
            var blockDomText = "<span id='domText"+idFlag+"' class='blockWrod'>"+inputResult+"</span>";//块状字符dom元素
            //idFlag++;//计数器数值加1
            //$input.data('id',$input.data('id')+1);//input数值加1
            //$('#textareaWrap').append(blockDomText);//块状字符插入
            $input.before(blockDomText);//块状字符插入

        }else{ //终止符是空格
            //$input.val($input.val().substr(1));
            $input.html($input.html().substr(1));
            setCursorPosition($input[0],0);//设置光标位置,在空格之前

            if (startIndex !== inputResult.index){
                var commonResult = recentValue.slice(startIndex,inputResult.index); //正常字符
                var commonDomText = "<span id='domText"+idFlag+"' class='commonWrod' onclick='editDomText(event)'>"+commonResult+"</span>";//正常字符dom元素
                //idFlag++;//计数器数值加1
                //$input.data('id',$input.data('id')+1);//input数值加1
                //$('#textareaWrap').append(commonDomText);//普通字符插入
                $input.before(commonDomText);//普通字符插入
            }

            startIndex = blockWord.lastIndex;//设置下次开始正则匹配的位置,因为是空格,不可能为起始符!
            blockWord.lastIndex; //然而exec的正则自带index也要对应减一,因为是空格,不可能为起始符!
            //console.log(startIndex);
            
            var inputResult = recentValue.slice(inputResult.index,startIndex);
            var blockDomText = "<span id='domText"+idFlag+"' class='blockWrod'>"+inputResult+"</span>";//块状字符dom元素
            //idFlag++;//计数器数值加1
            //$input.data('id',$input.data('id')+1);//input数值加1
            //$('#textareaWrap').append(blockDomText);//块状字符插入
            $input.before(blockDomText);//块状字符插入
        }
        
    }
    if (startIndex !== endIndex){
        var commonResult = recentValue.slice(startIndex,endIndex); //正常字符
        var commonDomText = "<span id='domText"+idFlag+"' class='commonWrod' onclick='editDomText(event)'>"+commonResult+"</span>";//正常字符dom元素
        //idFlag++;//计数器数值加1
        //$input.data('id',$input.data('id')+1);//input数值加1
        //$('#textareaWrap').append(commonDomText);//普通字符插入
        $input.before(commonDomText);//普通字符插入
    }
    
    //console.log($input.data('id'));

})


/* 工具函数 */
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

//设置光标位置 //设置dom元素中光标位置
function setCursorPosition(ctrl, pos){ 
    if(ctrl.setSelectionRange){ 
        ctrl.focus(); 
        ctrl.setSelectionRange(pos,pos); 
    } 
    else if (ctrl.createTextRange) { 
        var range = ctrl.createTextRange(); 
        range.collapse(true); 
        range.moveEnd('character', pos); 
        range.moveStart('character', pos); 
        range.select(); 
    } 
}

//可编辑DIV的光标获取与设置方法
//移到结尾
function cursorMoveEnd(dom) {
    var div = dom;
    var range = document.createRange();  
    var len = div.childNodes[0].length;
    divTextChild = div.childNodes[0];  
    range.setStart(divTextChild, len);  
    range.setEnd(divTextChild, len);
    div.focus();  
    window.getSelection().removeAllRanges();//Chrome不支持selection中多个range对象,所以在添加之前我们要把selection清空
    window.getSelection().addRange(range);
 
}
//右移一格
function moveRightOneStep(dom) {
    var div = dom;
    var range = document.createRange();  
    var len = div.childNodes.length;  
    range.setStart(div, 1);  
    range.setEnd(div, 1);  
    getSelection().addRange(range);  
    div.focus(); 
}
    
function test1(){  
    var div = document.getElementById("msgdiv");  
    
    // var range;
    // if (window.getSelection) { //现代浏览器
    //     range = window.getSelection();
    // //}else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
    // } else{ //IE浏览器 考虑到Opera，应该放在后面
    //     range = document.selection.createRange();
    // }

    var range = document.createRange();  
    //var len = div.childNodes.length;

    var childDiv = div.childNodes[0];
    var len = childDiv.length;

    //divTextChild = div.childNodes[0];  
    // range.setStart(div, len);  
    // range.setEnd(div, len);
    // div.focus();  
    // window.getSelection().removeAllRanges();//Chrome不支持selection中多个range对象,所以在添加之前我们要把selection清空
    // window.getSelection().addRange(range);

    //div.focus();  
    
    range.setStart(childDiv, len-2);  
    range.setEnd(childDiv, len-2);
    div.focus();  
    window.getSelection().removeAllRanges();//Chrome不支持selection中多个range对象,所以在添加之前我们要把selection清空
    window.getSelection().addRange(range);

    
}  
