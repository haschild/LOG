<template>
    <div>
        <p>样式1</p>
    <ul class="demo1 line-animation">
        <li>首页</li>
        <li>产品</li>
        <li>服务</li>
        <li>关于</li>
    </ul>
    
    <p>样式2</p>
    <ul class="demo2 line-animation">
        <li>首页</li>
        <li>产品</li>
        <li>服务</li>
        <li>关于</li>
    </ul>
    
    <p>样式3</p>
    <ul class="demo3 line-animation">
        <li>首页</li>
        <li>产品</li>
        <li>服务</li>
        <li>关于</li>
    </ul>
    
    <p>样式4</p>
    <ul class="demo4 line-animation">
        <li>首页</li>
        <li>产品</li>
        <li>服务</li>
        <li>关于</li>
    </ul>
    </div>
</template>
<style  lang="scss">
    p{
        text-align: center;
        margin: 40px 0 10px 0;
    }
    ul.line-animation{
        padding: 0;
        width: 400px;
        height: 45px;
        margin:  auto;
        list-style: none;
        background-color: #0000004d;
        display: flex;

        li{
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    }
    
    /***************样式1   *********/
    .demo1 li:before{
        content: '';
        position: absolute;
        width: 80%;
        left: 10%;
        bottom: 10px;
        height: 5px;
        background-color: coral;
        opacity: 0;
    }
    .demo1 li:hover:before{
        bottom: 0;
        opacity: 1;
        transition: bottom 0.3s,opacity 0.3s 0.1s;
    }
    /***************样式2   *********/
    .demo2 li:before{
        content: '';
        position: absolute;
        width: 0;
        left: 50%;
        bottom: 0;
        height: 5px;
        background-color: coral;
    }
    .demo2 li:hover:before{
        width: 80%;
        left: 10%;
        transition: all 0.5s;
    }
    /***************样式3   *********/
    .demo3 li:before{
        content: '';
        position: absolute;
        width: 0;
        left: 100%;
        bottom: 0;
        height: 2px;
        background-color:var(--el-color-primary)
    }
    .demo3 li:hover:before{
        width: 80%;
        left: 20%;
        transition: all 0.6s;
    }
    .demo3 li:hover ~ li:before{
        left: 0;
    }
    
    /***************样式4   *********/
    .demo4 li:before{
        content: '';
        position: absolute;
        width: 0;
        left: 0;
        bottom: 0;
        height: 5px;
        background-color: coral;
    }
    .demo4 li:after{
        content: '';
        position: absolute;
        width: 0;
        right: 0;
        bottom: 0;
        height: 5px;
        background-color: coral;
    }
    .demo4 li:hover:before{
        width: 50%;
        transition: all 0.3s ease-in-out; 
    }
    .demo4 li:hover:after{
        width: 50%;
        transition: all 0.3s ease-in-out;
    }
</style>