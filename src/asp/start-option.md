# 配置管理

## 配置文件

正确安装Z-BlogASP后会以如路径`path/zb_users/c_option.asp`生成一份配置文件，写有包括「数据库信息」在内的所有「系统配置」
，进行空间迁移，数据库更换等操作时，可能需要手动修改此文件来完成操作。

<!-- @include: ./terms/path.md -->

**重要：因为所有配置信息在数据库内也有一份，仅建议修改文件内的「数据库连接信息」，且修改后需要在首次登录时在「后台配置中」进行一次相同修改并保存。**

## 后台登录

`host/zb_system/cmd.asp?act=login` 会跳转到：`host/zb_system/login.asp`

<!-- @include: ./terms/host.md -->

可以在`网站设置`选项中对站点进行设置管理；
