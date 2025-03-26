# 淼森网站部署指南

本指南将帮助您将淼森网站部署到Cloudflare Pages。Cloudflare Pages是一个静态网站托管服务，提供免费计划，非常适合展示型网站。

## 准备工作

在开始部署之前，您需要：

1. 一个Cloudflare账户（可以免费注册）
2. 一个GitHub账户（用于存储代码）

## 步骤1：创建Cloudflare账户

1. 访问 [Cloudflare官网](https://www.cloudflare.com/)
2. 点击右上角的"Sign Up"按钮
3. 填写您的电子邮件地址、密码和姓名
4. 点击"创建账户"
5. 按照指示完成账户验证

## 步骤2：创建GitHub仓库并上传代码

1. 访问 [GitHub官网](https://github.com/)
2. 登录您的GitHub账户
3. 点击右上角的"+"图标，选择"New repository"
4. 填写仓库名称（例如"miaosen-website"）
5. 选择"Public"（公开）或"Private"（私有）
6. 点击"Create repository"
7. 按照GitHub页面上的指示，将淼森网站代码上传到这个仓库

## 步骤3：在Cloudflare Pages中创建新项目

1. 登录您的Cloudflare账户
2. 在左侧导航栏中，点击"Pages"
3. 点击"创建应用程序"按钮
4. 选择"连接到Git"
5. 选择GitHub作为您的Git提供商
6. 授权Cloudflare访问您的GitHub账户
7. 选择包含淼森网站代码的仓库
8. 点击"开始设置"

## 步骤4：配置构建设置

在Cloudflare Pages的构建设置页面中：

1. 项目名称：输入"miaosen"或您喜欢的名称
2. 生产分支：选择"main"或"master"（取决于您的GitHub仓库默认分支）
3. 构建设置：
   - 构建命令：`npm run build`
   - 构建输出目录：`.next`
4. 环境变量：
   - 添加以下环境变量：
     - `NODE_VERSION`: `18.x`
5. 点击"保存并部署"

## 步骤5：等待部署完成

Cloudflare Pages将开始构建和部署您的网站。这个过程可能需要几分钟时间。您可以在Cloudflare Pages控制台中查看部署进度。

## 步骤6：访问您的网站

部署完成后，Cloudflare Pages将提供一个URL（通常是`https://your-project-name.pages.dev`）。您可以通过这个URL访问您的淼森网站。

## 步骤7：配置自定义域名（可选）

如果您有自己的域名，您可以将其连接到您的Cloudflare Pages网站：

1. 在Cloudflare Pages项目中，点击"自定义域"选项卡
2. 点击"设置自定义域"按钮
3. 输入您的域名（例如`miaosen.com`）
4. 按照Cloudflare的指示完成DNS配置

## 故障排除

如果您在部署过程中遇到任何问题，请检查：

1. 确保您的GitHub仓库中包含了所有必要的文件
2. 检查构建命令和输出目录是否正确
3. 查看Cloudflare Pages的构建日志，了解可能的错误

## 更新网站

当您需要更新网站内容时，只需将更改推送到GitHub仓库，Cloudflare Pages将自动重新构建和部署您的网站。

## 技术支持

如果您需要进一步的帮助，可以：

1. 查阅 [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
2. 联系Cloudflare支持团队
3. 在GitHub上搜索相关问题和解决方案
