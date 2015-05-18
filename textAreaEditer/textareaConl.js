console.log(getAllSpanValue('#richedit'));
/*全局状态值*/

//keydown的时候把空格事件给干掉
$('#richedit').keydown(function(event){
    var code = event.which;//当前键值
    if (code===32){
        // var currentText = $currentSpan.html();
        
        //$('#mainSpan').append('\u0020');
        return false;
        //return false;
        //console.log('forbid');
        //return false;
        
    }
})

//每一次编辑时键盘keyup事件触发
$('#richedit').keyup(function(event){
    var $input = $(event.currentTarget);//当前编辑区
    var $cuurentSpan = $()
    var currentString = getAllSpanValue('#richedit');

    var code = event.which;//当前键值

    var blockWordNotGlobal = /[@&$!|][\u4E00-\u9FA5A-Za-z0-9_]+&nbsp;/;//非全局正则
    var blockWord = /[@&$!|][\u4E00-\u9FA5A-Za-z0-9_]+&nbsp;/g ;//匹配@数字or英文or中文|,设置全局标志g,循环匹配
    var inputResult = []; //匹配的第一个值(按逻辑当前只有一个)
    
    var startIndex = 0;
    var endIndex = currentString.length;//value长度

    if (code === 32){ //检测到输入了空格,立即开始匹配查询
        //console.log('start');
        $('#mainSpan').html($('#mainSpan').html()+' ');

        while (blockWordNotGlobal.test(currentString.slice(startIndex,endIndex))){
            inputResult = blockWord.exec(currentString);

            if(startIndex !== inputResult.index){
                var commonResult = currentString.slice(startIndex,inputResult.index);
                var commonDomText = "<span class='commonWrod'>"+commonResult+"</span>";//正常字符dom元素
                $input.before(commonDomText);//普通字符插入
            }

            startIndex = blockWord.lastIndex;//设置下次正则匹配的位置

            inputResult = currentString.slice(inputResult.index,startIndex);
            var blockDomText = "<span class='blockWrod'>"+inputResult+"</span>";//块状字符dom元素
            $input.before(blockDomText);//普通字符插入
        }


    }

})



/*工具函数*/
//获取目标区域内所有span字符
function getAllSpanValue(dom){
    var $wordArea;
    if (typeof dom == 'string'){
        $wordArea = $(dom) ; 
    }
    var stringInside ='';
    $wordArea.find('span').each(function(index,value){
        stringInside += $(value).html();
    })

    return stringInside ;
}
//把指定文本变回span格式,与getAllSpanValue相反
function strTrans2Span(string,dom){
    var $wordArea;
    var recentValue = string;
    if (typeof dom == 'string'){
        $wordArea = $(dom);
    }
    $wordArea.empty();
    var blockWordNotGlobal = /[@&$!|][\u4E00-\u9FA5A-Za-z0-9_]+\s/;//非全局正则
    var blockWord = /[@&$!|][\u4E00-\u9FA5A-Za-z0-9_]+\s/g ;//匹配@数字or英文or中文|,设置全局标志g,循环匹配
    
    var inputResult = [];//每次匹配的结果数组
    var startIndex = 0;
    var endIndex = recentValue.length;//value长度

    while (blockWordNotGlobal.test(recentValue.slice(startIndex,endIndex))){
        inputResult = blockWord.exec(recentValue);

        if (startIndex !== inputResult.index){
            var commonResult = recentValue.slice(startIndex,inputResult.index);
            var commonDomText = "<span class='commonWrod'>"+commonResult+"</span>";//正常字符dom元素
            $wordArea.append(commonDomText);
        }

        startIndex = blockWord.lastIndex;//设置下次开始正则匹配的位置

        var inputResult = recentValue.slice(inputResult.index,startIndex);
        var blockDomText = "<span class='blockWrod'>"+inputResult+"</span>";//块状字符dom元素
        $wordArea.append(blockDomText);//块状字符插入
    }
    if (startIndex !== endIndex){
        var commonResult = recentValue.slice(startIndex,endIndex); //正常字符
        var commonDomText = "<span class='commonWrod'>"+commonResult+"</span>";//正常字符dom元素
        $wordArea.append(commonDomText);//普通字符插入
    }
    

}