var X = 0;
var x = 0;
var score ;
var scores ;
//画布尺寸
var canvasWidth = 1024;
var canvasHeight = 600;
//障碍物参数
var VbarrierWidth = 40;
var VbarrierHeight = 70;
var VbarrierCount = 1;

var HbarrierWidth = 70;
var HbarrierHeight = 50;
var HbarrierCount = 1;
//人物参数
var ppWidth = 50;
var ppHeight = 75;

var jumpMax = 360;   //最大跳跃高度（点）
var originP = 470;   //人物原点
//按钮标志位
var upSign  = 0;
var downSign = 0;

var lose = 0;

var page = {
    data : {timer1 : 0, timer2 : 0, timer3 : 0, timer4 : 0, timer5 : 0, timer6 : 0, timer7 : 0, timer8 : 0, timer9 : 0},
    ppData : {  //小人位置信息
        normal: { 
                x : 20,
                y : 471,
        },
        down: {
                x : 1500,
                y : 1500,
        }
    },

    //生成障碍物
    createBarrier:function(barriertype) {
        var obj = new Object();

        if(barriertype == "vertical") {
            obj.x = canvasWidth - VbarrierWidth / 2;
            //obj.y = barrierHeight / 2 + Math.random() * (canvasHeight - barrierHeight);
            obj.y = 523;
            this.VbarrierArray.push(obj);
        } else if(barriertype == "horizontal") {
            obj.x = canvasWidth - HbarrierWidth / 2;
            obj.y = 470;
            this.HbarrierArray.push(obj);
        }
    },


    //移动障碍物
    moveBarrier:function() {
        for (i = 0; i < this.VbarrierArray.length; i++) {
            var barrier = this.VbarrierArray[i];
            barrier.x -= 10;
            if (barrier.x  < 0 || barrier.x > canvasWidth || barrier.y < 0 || barrier.y > canvasHeight)
                this.VbarrierArray.splice(i, 1);
        }
    
        for (i = 0; i < this.HbarrierArray.length; i++) {
            var barrier = this.HbarrierArray[i];
            barrier.x -= 10;
            if (barrier.x  < 0 || barrier.x > canvasWidth || barrier.y < 0 || barrier.y > canvasHeight)
                this.HbarrierArray.splice(i, 1);
        }
    },

    //小人掉落
    ppJumpDown:function() {
        var thiz = this;
        this.data.timer3 = setInterval(function()
        {
            thiz.ppData.normal.y += 5;  
            if(thiz.ppData.normal.y > originP)
                clearInterval(thiz.data.timer3);
        }, 30);
    },

    //小人跳跃
    ppJump:function() {
        var thiz = this;
        thiz.ppData.normal.y -= 5; 
        if (thiz.ppData.normal.y < jumpMax){
            upSign = 0;
            thiz.ppJumpDown();
        }
    },

    //小人下蹲
    ppDown:function() {
        var thiz = this;
        downSign = 0;

        thiz.ppData.normal.x = 1500;
        thiz.ppData.normal.y = 1500;
        thiz.ppData.down.x = 20;
        thiz.ppData.down.y = 499;
        this.data.timer4 = setTimeout(function()
        {    
            thiz.ppData.normal.x = 20;
            thiz.ppData.normal.y = 471;
            thiz.ppData.down.x = 1500;
            thiz.ppData.down.y = 1500;
        },800);
    },

    //小人无限掉落
    ppLongdown: function() {
        var thiz = this;
        this.data.timer8 = setInterval(function()
        {
            thiz.ppData.normal.y += 5;  
        }, 100);
    },

    //判断是否撞到障碍物
    isHit: function() {
        var ppNow = this.ppData.normal;
        for(j = 0; j < this.VbarrierArray.length; j++){
            var barrier = this.VbarrierArray[j]
            if(barrier.x > ppNow.x - (ppWidth / 2 + VbarrierWidth / 2) &&
                barrier.x < ppNow.x + (ppWidth / 2 + VbarrierWidth / 2) &&
                barrier.y > ppNow.y - (ppHeight / 2 + VbarrierHeight / 2) &&
                barrier.y < ppNow.y + (ppHeight / 2 + VbarrierHeight / 2)){
                    lose = 1;
                }
        }

        for(j = 0; j < this.HbarrierArray.length; j++){
            var barrier = this.HbarrierArray[j]
            if(barrier.x > ppNow.x - (ppWidth / 2 + HbarrierWidth / 2) &&
                barrier.x < ppNow.x + (ppWidth / 2 + HbarrierWidth / 2) &&
                barrier.y > ppNow.y - (ppHeight / 2 + HbarrierHeight / 2) &&
                barrier.y < ppNow.y + (ppHeight / 2 + HbarrierHeight / 2)){
                    lose = 1;
                }
        }

        var dpNow = this.ppData.down;
        for(j = 0; j < this.VbarrierArray.length; j++){
            var barrier = this.VbarrierArray[j]
            if(barrier.x > dpNow.x - (ppWidth / 2 + VbarrierWidth / 2) &&
                barrier.x < dpNow.x + (ppWidth / 2 + VbarrierWidth / 2) &&
                barrier.y > dpNow.y - (ppHeight / 2 + VbarrierHeight / 2) &&
                barrier.y < dpNow.y + (ppHeight / 2 + VbarrierHeight / 2)){
                    lose = 1;
                }
        }

        for(j = 0; j < this.HbarrierArray.length; j++){
            var barrier = this.HbarrierArray[j]
            if(barrier.x > dpNow.x - (ppWidth / 2 + HbarrierWidth / 2 ) &&
                barrier.x < dpNow.x + (ppWidth / 2 + HbarrierWidth / 2 ) &&
                barrier.y < dpNow.y - (ppHeight / 2 + HbarrierHeight / 2) &&
                barrier.y > dpNow.y + (ppHeight / 2 + HbarrierHeight / 2)){
                    lose = 1;
                }
        }
    },

    //绘画函数
    paintEverything : function() {
        var ctx = pm.createCanvasContext('Canvas1', this, 1);

        //画背景
        if (X > canvasWidth)
                X -= canvasWidth
            ctx.drawImageSimple('background1.png', -X, 0);
            ctx.drawImageSimple('background1.png', canvasWidth - X, 0);
            X += 10;

        // 画障碍物
            var VbarrierCount = this.VbarrierArray.length;
            for (i = 0; i < VbarrierCount; i++) {
                ctx.drawImageSimple('nbarrier.png',
                    this.VbarrierArray[i].x - VbarrierWidth / 2,
                    this.VbarrierArray[i].y - VbarrierHeight / 2);
            };

            var HbarrierCount = this.HbarrierArray.length;
            for (i = 0; i < HbarrierCount; i++) {
                ctx.drawImageSimple('hbarrier.png',
                    this.HbarrierArray[i].x - HbarrierWidth / 2,
                    this.HbarrierArray[i].y - HbarrierHeight / 2);
            };

        // 画小人
            ctx.drawImageSimple('npp.png', this.ppData.normal.x, this.ppData.normal.y);
            ctx.drawImageSimple('dpp.png', this.ppData.down.x, this.ppData.down.y); 

        //失败标志
            if(lose){
            ctx.drawImageSimple('gameover.png', 150, 10);
            this.ppLongdown();
            }   

        //分数
            ctx.drawImageSimple('score.png', 800, 10);

        //返回箭头
            ctx.drawImageSimple('back.png', 15, 15);
    },

    

    /* 此方法在第一次显示窗体前发生 */
    onLoad:function(event){
        var thiz = this;
        x = 0;
        score = 0;
        scores = 0;
        var ctx = pm.createCanvasContext('Canvas1', this, 1);

        this.VbarrierArray = new Array();
        this.HbarrierArray = new Array();

        this.data.timer1 = setInterval(function()
        {
            if(x < 10)
                {
                    score = x + '.png';
                } else if(x >= 10)
                {
                    ones = x % 10;
                    tens = (x - ones)/10;
                    score = ones + '.png';
                    scores = tens + '.png';
                }
            thiz.paintEverything();
            thiz.moveBarrier();
            thiz.isHit();
            ctx.drawImageSimple(score, 935, 10);
            ctx.drawImageSimple(scores, 900, 10);
            ctx.draw();
        }, 50);

        this.data.timer2 = setInterval(function()
        {
            if(upSign){
                thiz.ppJump();
            }
            ctx.draw();
        }, 40);

        this.data.timer5 = setInterval(function()
        {
            if(downSign){
                thiz.ppDown();
            }
            ctx.draw();
        }, 100);

        this.data.timer6 = setInterval(function()
        {
            while(thiz.VbarrierArray.length < VbarrierCount){
                thiz.createBarrier("vertical");
            }
            ctx.draw();
        }, 1000);

        this.data.timer7 = setInterval(function()
        {
            while(thiz.HbarrierArray.length < HbarrierCount){
                thiz.createBarrier("horizontal");
            }
            ctx.draw();
        }, 3000);

        this.data.timer9 = setInterval(function()
            {
                x += 1;
                if(lose){
                clearInterval(thiz.data.timer9);
                }
            }, 1000);
    },

    /* 此方法展示窗体前发生 */
    onShow:function(event){

    },

    /* 此方法关闭窗体前发生 */
    onExit:function(event){
        
    },

    onBtn:function(event){
        switch(event.target.id){
            case "up" :
                upSign = 1;
                break;
            case "down" :
                downSign = 1;
                break;
            case "back" :
                if (this.data.timer1 != 0)
                    clearInterval(this.data.timer1);
                if (this.data.timer2 != 0)
                    clearInterval(this.data.timer2);
                if (this.data.timer3 != 0)
                    clearInterval(this.data.timer3);
                if (this.data.timer4 != 0)
                    clearInterval(this.data.timer4);
                if (this.data.timer5 != 0)
                    clearInterval(this.data.timer5);
                if (this.data.timer6 != 0)
                    clearInterval(this.data.timer6);
                if (this.data.timer7 != 0)
                    clearInterval(this.data.timer7);
                if (this.data.timer8 != 0)
                    clearInterval(this.data.timer8);
                if (this.data.timer9 != 0)
                    clearInterval(this.data.timer9);
                pm.redirectTo('start/start');
            default :
                break;
        }
    },
};

Page(page);

page = 0;