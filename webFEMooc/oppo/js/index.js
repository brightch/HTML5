var index = 0;
$(function () {
    
    $(".rt_btn .left_btn").click(function () {
        index++;
        // alert(index);
        if (index > 3)
            index = 0;
        $(".item").eq(index).slideDown(1000).siblings().slideUp(1000);
        $(".tab_btn .btn").eq(index).addClass("active").siblings().removeClass("active");
    });
    $(".rt_btn .right_btn").click(function(){
        index--;
        // alert(index);
        if (index <0)
            index = 3;
        $(".item").eq(index).fadeIn().siblings().fadeOut();
        $(".tab_btn .btn").eq(index).addClass("active").siblings().removeClass("active");
    });
    $(".tab_btn .btn").click(function(){
       var i= $(this).index();
       $(".item").eq(i).fadeIn().siblings().fadeOut();
       $(".tab_btn .btn").eq(i).addClass("active").siblings().removeClass("active");
    })
    setInterval("show()",5000);

});

function show(){
 index++;
 if(index>3)
 {
     index=0;
 }
 $(".item").eq(index).fadeIn().siblings().fadeOut();
 $(".tab_btn .btn").eq(index).addClass("active").siblings().removeClass("active");
}