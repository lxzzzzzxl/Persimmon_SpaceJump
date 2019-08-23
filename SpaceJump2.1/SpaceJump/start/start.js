var page = {

    /* 此方法在第一次显示窗体前发生 */
    onLoad:function(event){

    },

    /* 此方法展示窗体前发生 */
    onShow:function(event){

    },

    /* 此方法关闭窗体前发生 */
    onExit:function(event){
        console.log('ss')
    },

    onBtn:function(event){    
        pm.navigateTo('run/run');
    },
};

Page(page);

page = 0;
