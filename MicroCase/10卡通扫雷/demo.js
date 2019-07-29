//同步注释
//点击开始游戏  --》动态生成100个格子 100个div

//leftClick 没有雷 --》显示数字（周围八个格子的雷数）
//扩散 当前周围八个格没有雷（中间数字显示雷）知道被数字包围

//rightClick 有标记取消标记，没有标记就进行标记。

var flagBox = document.getElementById('flagBox');
var startBtn = document.getElementById('btn');
var box = document.getElementById('box');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var closeBtn = document.getElementById('close');
// 显示分数的span
var score = document.getElementById('score');
var minesNum;//雷的数量
var mineOver;//被标记的雷的数量
var block;//取一百个小格子
var mineMap = [];//代表当前小格子是否有雷
// 标记游戏状态，当为false是表示游戏进行中，点击开始按钮无效
var startGameBool = true;
                         
bindEvent();             
function bindEvent() {
    // 点击开始游戏按钮
    startBtn.onclick = function () {
        if(startGameBool){
            // 显示游戏区域
            box.style.display = 'block';
            // 显示剩余雷数信息的div
            flagBox.style.display = 'block';
            // 初始化操作
            init();
            startGameBool = false;
        }
    }
    box.oncontextmenu = function () {//在box内取消默认右键点击
        return false;
    }
    box.onmousedown = function (e) {//判断鼠标点击的是左键还是右键
        //获取当前点的是哪个小格子   
        // target 事件属性可返回事件的目标
        // 节点（触发该事件的节点），
        // 如生成事件的元素、文档或窗口。
        var event = e.target;//获取当前点的是哪个小格子   target 事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口。
        if (e.which == 1) {//which==1 是左键
            leftClick(event);
        } else if (e.which == 3) {//which==3 代表右键点击
            rightClick(event);
        }
    }
    closeBtn.onclick = function () {//点X之后所有都消失
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';
        startGameBool = true;
    }
}
// 游戏初始化操作
function init() {//生成一百个小格子 并且插入box 同时生成10个随机的雷
    // 地雷数量
    minesNum = 10;
    // 剩余地雷数量
    mineOver = 10;
    // 显示剩余雷数量
    score.innerHTML = mineOver;
    for (var i = 0; i < 10; i++) {//十行
        for (var j = 0; j < 10; j++) {//十列
            var con = document.createElement('div');
            con.classList.add('block');//给生成的每个小格子加一个类名
            //给每个小格子加一个id id是i和j的坐标值
            con.setAttribute('id', i + '-' + j);
            box.appendChild(con);
            //每次生成小格子往数组里面传, 传一个参数mine 初始值0
            mineMap.push({ mine: 0 });
        }
    }
    //把一百个小格子利用同类名取出来
    // 根据class获取全部扫雷的格子区域
    block = document.getElementsByClassName('block');
    while (minesNum) {
        //雷通过随机数出现的位置
        // 将minesNUm颗地雷随机放入格子中
        var mineIndex = Math.floor(Math.random() * 100);
        if (mineMap[mineIndex].mine === 0) {//没有雷
            mineMap[mineIndex].mine = 1;//防止同一位置重复生成雷
            block[mineIndex].classList.add('isLei');
            minesNum--;
        }
    }
}
// //点左键,看哪个小格子被点击了
function leftClick(dom) {
    // 如果格子已经使用右键标记，那么点击左键无效
    //被标记之后不能点击
    if(dom.classList.contains('flag')){
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    // 如果当前格子有地雷，那么点击错误，显示所有地雷
    // 判断点击的是雷
    if (dom && dom.classList.contains('isLei')) {
    //    将所有的包含地雷格子显示地雷
        for (var i = 0; i < isLei.length; i++) {
            isLei[i].classList.add('show');
        }
        //让弹出的gameover延迟弹出
        // 过200毫秒后，显示alertImg
        setTimeout(function () {
            alertImg.style.display = 'block';
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = "url('img/gameover.png')";
        }, 200)
    } else {
        // 当前的格子没有地雷
        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-');
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add('num');//点到数字的背景

        for (var i = posX - 1; i <= posX + 1; i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {
                var aroundBox = document.getElementById(i + '-' + j);
                if (aroundBox && aroundBox.classList.contains('isLei')) {
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        if (n == 0) {//扩散情况     当点击到的是0,再遍历周围八个每一个
            for (var i = posX - 1; i <= posX + 1; i++) {//再遍历周围八个
                for (var j = posY - 1; j <= posY + 1; j++) {
                    var nearBox = document.getElementById(i + '-' + j);
                    if (nearBox && nearBox.length != 0) {
                        if (!nearBox.classList.contains('check')) {//如果不存在classlist不包括check,每个判断一次
                            nearBox.classList.add('check');//显示完的加一个标记 被判断过的 被显示过的
                            leftClick(nearBox);//n = 0的时候结束
                        }
                    }
                }
            }
        }
        //判断八个方向是否有雷  i-1，j-1  i-1,j  i-1,j+1
        //                    i,j-
             i,j    i,j+1
        //                    i+1,j-1   i+1,j  i+1,j+1
    }
}

function rightClick(dom) {
    if (dom.classList.contains('num')) {   //有数字的就不能插旗了
        return;
    }
    //toggle() 方法切换元素的可见状态。 如果被选元素可见，则隐藏这些元素，如果被选元素隐藏，则显示这些元素。
    dom.classList.toggle('flag');
    //判断当前被点击的dom的classlist是否包含点完出数字的num
    if (dom.classList.contains('isLei') && dom.classList.contains('flag')) {
        mineOver--;
    }
    if (dom.classList.contains('isLei') && !dom.classList.contains('flag')) {
        mineOver++;
    }

    score.innerHTML = mineOver;
    if (mineOver == 0) {
        alertBox.style.display = 'block';
        alertImg.style.display = 'block';
        alertImg.style.backgroundImage = "url('img/successful.png')";
    }
}





