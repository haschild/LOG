export interface acceptModels {
    // 返回状态码
    code:number,
    // 错误信息
    msg:string
    // 返回数据
    data?:Array<any>|string
}


export interface navigateModels{
    path:string,
    query:acceptModels
}
