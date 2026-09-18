## 文件结构（插件）

以下基于通过「[创建应用](/php/dev-start#创建应用 "创建应用")」生成的初始文件：

```text
/path/zb_users/plugin/demoPlugin
│  logo.png       [必需]图标，128x128；
│  plugin.xml     [必需]自述文件；
│  main.php       [可选]应用内置管理页，在创建插件时填写才会生成；
│  include.php    [可选]应用嵌入页，在创建插件时填写才会生成；
│
```

自动创建的文件最多只有上边四个，可依据需要自行创建需要的文件夹及文件：

```text
│  function.php   [可选]根目录下除了这个外不建议放置额外的「*.PHP」文件；
│                      「function.php」放不下的，可以拆分后放置到「function」文件夹；
├─class           [可选]放置 class 定义文件，；
├─css             [可选]CSS 样式文件，前后台尽量分开；
├─script          [可选]JS 脚本目录，前后台尽量分开；
└─other           [可选]其他任意自定义文件夹及内容
```
**推荐**：独立 PHP 文件（含 `function.php`、class 目录下的文件）应在文件开头加入防直接访问保护，防止被直接访问：

```php
if (!defined('ZBP_PATH')) {exit();}
```

> 防止浏览器直接访问该文件时执行内部代码、暴露报错信息。经由系统正常流程加载的文件不受影响（`ZBP_PATH` 已定义）。

<!-- docs\books\include\plugin-structures.md -->
