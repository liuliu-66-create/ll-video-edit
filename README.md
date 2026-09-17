# ll-video-edit

`ll-video-edit` 是一个面向教程型视频的 Codex 自动剪辑 Skill。它按照固定六步流程，引导用户从定稿逐字稿和配音开始，完成音频对齐、分镜、真实素材准备、静态视觉确认、动态样片确认和完整视频交付。

> 当前版本：`v0.1.0` 技术预览版。已经包含 Skill、六步 SOP 和 16:9 Remotion 动效素材库，但还不是面向完全小白的一键安装版本。

## 适合谁

- 会使用 Codex，并能从 GitHub 下载项目；
- 已经有定稿逐字稿；
- 不熟悉如何用 Codex 与 Remotion 完成自动剪辑。

它不负责写稿、改稿、剪口误，也不会跳过确认直接生成全片。

## 使用前准备

- Codex；
- Node.js 与 npm；
- FFmpeg 与 ffprobe；
- 可用的火山引擎豆包语音服务；
- 仓库已经附带的 `motion-library` 动效素材库。

真实软件操作画面在分镜确认后按清单录制，不需要提前准备人物口播视频。

## 安装

1. 下载或克隆本仓库，并保留完整目录，不要只复制 `skill` 文件夹。
2. 将 `skill/ll-video-edit` 文件夹安装到 Codex Skills 目录。
3. 进入 `motion-library` 安装 Remotion 依赖：

```powershell
npm.cmd ci
```

4. 把环境变量 `LL_VIDEO_MOTION_LIBRARY` 设置为本仓库内 `motion-library` 的绝对路径，然后重启 Codex。Windows PowerShell 示例：

```powershell
[Environment]::SetEnvironmentVariable(
  "LL_VIDEO_MOTION_LIBRARY",
  "D:\path\to\ll-video-edit\motion-library",
  "User"
)
```

5. 在第一次制作视频时，让 Codex 运行 `skill/ll-video-edit/scripts/check_environment.ps1`。检查结果中的 `readyForRendering` 为 `true` 后再开始渲染。

## 开始第一条视频

在 Codex 中输入：

```text
使用 $ll-video-edit 带我制作第一条自动剪辑视频。
```

Skill 的第一句话只会询问选择 `16:9` 横屏还是 `9:16` 竖屏，然后一次推进一个步骤。

## 六步结果

1. 确定画幅、接收定稿逐字稿并生成最终配音；
2. 对齐音频并完成分镜表；
3. 按分镜准备真实素材包；
4. 套用视觉模板并确认静态效果图；
5. 制作带原配音的动态样片；
6. 完成全片、修改并验收交付。

完成后交付完整 MP4、可继续编辑的 Remotion 工程、使用素材和验收结果。

## 第一版边界

- 当前素材库只完成了 `16:9` 横版验证；`9:16` 竖版需要重新排版和确认。
- 当前版本由 Codex 按 SOP 逐步执行，不是点击一次即可生成全片的软件。
- 使用者仍需安装 Codex、Node.js、npm、FFmpeg 与 ffprobe，并自行配置配音服务。
- 预览视频只用于挑选模板；正式成片会调用模板源码并替换为当前视频的文字、图片或真实录屏。
