# 六六视频动效素材库

这是独立于单条视频项目的共享动效素材库。模板本身不包含账号 Logo；Logo 在完整成片最外层统一添加。

## 素材库结构

- `DESIGN_RULES.md`：所有模板共同遵守的视觉、定位和检查规则。
- `template-rules`：每个已通过模板自己的用途、输入、布局、动效、调用和验收规则。
- `library.json`：模板登记表，记录用途、可替换内容和预览位置。
- `public/assets`：背景、撕纸、印章等公共素材。
- `src/templates`：真正生成画面的动效模板。
- `presets`：只需修改文字的示例配置。
- `previews`：供人选择模板的对外样片。
- `qa`：对齐辅助线和边界数量的内部检查结果。

## 已完成模板

- 多点列举：2～6点，规则见 `template-rules/multi-point-list/TEMPLATE.md`。
- 流程步骤：2～6步，支持折线和弯曲路线，规则见 `template-rules/process-flow/TEMPLATE.md`。
- 前后对比：左右对照，规则见 `template-rules/before-after-compare/TEMPLATE.md`。
- 概念解释：支持中心放射型和上下拆解型，规则见 `template-rules/concept-explainer/TEMPLATE.md`。
- 重点结论：突出一句核心结论，规则见 `template-rules/key-conclusion/TEMPLATE.md`。
- 真实录屏展示：无外框放大真实录屏，规则见 `template-rules/screen-recording-transition/TEMPLATE.md`。

## 使用原则

预览 MP4 只用于挑选模板。完整视频制作时，应调用对应模板并传入当前分镜的内容；不要把预览 MP4 当作固定素材剪进成片。具体输入、数量限制和检查要求，以该模板自己的 `TEMPLATE.md` 和 `layout.json` 为准。

## 新的固定流程

每确认一个模板，必须在进入下一个模板前同时完成：

1. 写入对应的 `template-rules/<模板>/TEMPLATE.md`。
2. 把贴纸位置、文字安全区和箭头方向登记到 `layout.json`。
3. 在 `library.json` 中登记规则、布局、合成项和预览视频。
4. 完成标准数量与边界数量检查后，状态才能标记为 `validated`。

## 本地预览

```powershell
npm.cmd run studio
```

## 渲染验证

```powershell
npm.cmd run render:multi-03-torn
```
