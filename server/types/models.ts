
  
  export interface WebSite {
    /**网站名称 */
    name: string;
    /**网站地址 */
    url: string;
    /**网站描述 */
    desc:string;
    /**网站图标 */
    icon?: string;
  }


  export interface WebSiteGroup {
    /**分组名称 */
    groupName: string;
    // /**分组描述 */
    // desc:string;
    // /**分组图标 */
    // icon?: string;
    // /**分组网站 */
    webSiteList: WebSite[];
  }



