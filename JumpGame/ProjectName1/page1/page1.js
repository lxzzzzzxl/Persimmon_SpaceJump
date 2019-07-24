var X = 0;

//画布尺寸
var canvasWidth = 480;
var canvasHeight = 272;

//障碍物参数
var barrierWidth = 10;
var barrierHeight = 30;
var barrierCount = 1;

var jumpMax = 155;   //最大跳跃高度（点）
var originP = 200;   //人物原点

//按钮标志位
var upSign  = 0;
var downSign = 0;


var page = {
    data : {timer1 : 0, timer2 : 0, timer3 : 0, timer4 : 0, timer5 : 0, timer6 : 0},

    //人物信息
    ppData : {
        normal: { 
            x : 20,
            y : 205,
        },
        down: {
            x : 500,
            y : 500,
        }
    },

    //生成障碍物
    createBarrier:function() {
        var obj = new Object();

        obj.x = canvasWidth - barrierWidth / 2;
        //obj.y = barrierHeight / 2 + Math.random() * (canvasHeight - barrierHeight);
        obj.y = 218;
        this.barrierArray.push(obj);
    },


    //移动障碍物
    moveBarrier:function() {
        for (i = 0; i < this.barrierArray.length; i++) {
            var barrier = this.barrierArray[i];
            barrier.x -= 5;
            if (barrier.x  < 0 || barrier.x > canvasWidth || barrier.y < 0 || barrier.y > canvasHeight)
                this.barrierArray.splice(i, 1);
        }
    },

    //小人掉落
    ppJumpDown:function() {
        var thiz = this;
        this.data.timer4 = setInterval(function()
        {
            thiz.ppData.normal.y += 5;  
            if(thiz.ppData.normal.y > originP)
                clearInterval(thiz.data.timer4);
        }, 100);
    },

    //小人跳跃
    ppJump:function() {
        this.ppData.normal.y -= 10; 
        if (this.ppData.normal.y < jumpMax){
            upSign = 0;
            this.ppJumpDown();
        }
    },

    //小人下蹲
    ppDown:function() {
        var thiz = this;
        downSign = 0;

        thiz.ppData.normal.x = 500;
        thiz.ppData.normal.y = 500;
        thiz.ppData.down.x = 20;
        thiz.ppData.down.y = 223;
        this.data.timer6 = setTimeout(function()
        {    
            thiz.ppData.normal.x = 20;
            thiz.ppData.normal.y = 205;
            thiz.ppData.down.x = 500;
            thiz.ppData.down.y = 500;
        },1000);
    },

    //绘画函数
    paintBackBarrier:function() {
            var ctx = pm.createCanvasContext('Canvas1', this, 1);

            // 画背景
            if (X > canvasWidth)
                X -= canvasWidth
            ctx.drawImageSimple('background.png', -X, 0);
            ctx.drawImageSimple('background.png', canvasWidth - X, 0);
            X += 1;

            ctx.drawImageSimple('beforeUP.png', 19, 238);       //UP按钮
            ctx.drawImageSimple('beroreDOWN.png', 382, 238);    //DOWN按钮

            // 画障碍物
            var barrierCount = this.barrierArray.length;
            for (i = 0; i < barrierCount; i++) {
                ctx.drawImageSimple('barrier.png',
                    this.barrierArray[i].x - barrierWidth / 2,
                    this.barrierArray[i].y - barrierHeight / 2);
            }

            // 画小人
            ctx.drawImageSimple('pp.png', this.ppData.normal.x, this.ppData.normal.y);
            ctx.drawImageSimple('sp.png', this.ppData.down.x, this.ppData.down.y); 
            },


    /* 此方法在第一次显示窗体前发生 */
    onLoad:function(event){
        var thiz = this;
        var ctx = pm.createCanvasContext('Canvas1', this, 1);

        this.barrierArray = new Array();

        this.data.timer1 = setInterval(function()
        {
            console.log('timer1 timeout');
            thiz.paintBackBarrier();
            thiz.moveBarrier();
            ctx.draw();
        }, 100);

        this.data.timer2 = setInterval(function()
        {
            console.log('timer2 timeout');
            if(upSign){
                thiz.ppJump();
            }
            ctx.draw();
        }, 100);

        this.data.timer3 = setInterval(function()
        {
            console.log('timer3 timeout');
            while(thiz.barrierArray.length < barrierCount){
                thiz.createBarrier();
            }
            ctx.draw();
        }, 2000);

        this.data.timer5 = setInterval(function()
        {
            console.log('timer5 timeout');
            if(downSign){
                thiz.ppDown();
            }
            ctx.draw();
        }, 100);

    },

    /* 此方法展示窗体前发生 */
    onShow:function(event){

    },

    /* 此方法关闭窗体前发生 */
    onExit:function(event){
        if (this.data.timer1 != 0)
            clearInterval(this.data.timer1);
    },

    

    onBtn:function(event){
        switch(event.target.id){
            case "up" :
                upSign = 1;
                break;
            case "down" :
                downSign = 1;
                break;
            default :
                break;
        }
    },
};

Page(page);

page = 0;
