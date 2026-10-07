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
- `playground`：可选的本地素材库展示页，包含真实动态样片和效果图缩略图。
- `qa`：对齐辅助线和边界数量的内部检查结果。

## 已完成模板

- 双向趋势：质量与价格变体已确认，仅作定性趋势示意；规则见 `template-rules/opposing-trends/TEMPLATE.md`。
- 投入累积／资源消耗：稿件增加与钱币减少，文字和插画分层，支持替换素材。规则见 `template-rules/cost-accumulation/TEMPLATE.md`。
- 剪贴画时间线：支持3～5个时间节点，无标题，插画在轴上、日期与说明在轴下。规则见 `template-rules/timeline-events/TEMPLATE.md`。
- 三方委托层级：固定表达上游决策方、中间承接方和实际制作方的三层关系。规则见 `template-rules/order-hierarchy/TEMPLATE.md`。
- 双选择：两个等权方向，只有核心选项使用真实撕纸强调。规则见 `template-rules/dual-choice/TEMPLATE.md`。
- 传递递减：用节点、资源数量和连接箭头表达多层传递后的持续损耗。规则见 `template-rules/transfer-decay/TEMPLATE.md`。
- 层级金字塔：从底层向上搭建，表达不依赖数量变化的层级与支撑关系。规则见 `template-rules/layered-pyramid/TEMPLATE.md`。
- 大数字卡：以一个核心数字为主角，撕纸只用于局部数据对照。规则见 `template-rules/big-number-card/TEMPLATE.md`。
- 阶段状态板：用连续进度带区分已完成、进行中和待开始，当前阶段原地突出。规则见 `template-rules/stage-status-board/TEMPLATE.md`。
- 不对等天平：用怀旧撕纸天平表达两端关系失衡。规则见 `template-rules/imbalance-scale/TEMPLATE.md`。
- 输入汇聚：多条短纸带从不同输入汇入唯一结果。规则见 `template-rules/input-convergence/TEMPLATE.md`。
- 动态数据图表：包含分类柱状图、时间趋势折线图、定性上升曲线和阶梯式增长。规则见 `template-rules/dynamic-data-chart/TEMPLATE.md`。
- 音频对齐时间线：表达逐句声音与画面的同步落点。规则见 `template-rules/audio-alignment-timeline/TEMPLATE.md`。
- 素材桌面：集中展示真实录屏、截图、品牌画面和声音素材。规则见 `template-rules/material-photo-desk/TEMPLATE.md`。
- 典型镜头胶片条：用三个代表性镜头概括一条视频的画面组合。规则见 `template-rules/typical-shot-filmstrip/TEMPLATE.md`。
- 分镜工作单：把一个镜头的时间、字幕、画面和素材整理为执行单。规则见 `template-rules/storyboard-work-order/TEMPLATE.md`。
- 检查结果列点：以五项通过结果和最终结论表达交付检查。规则见 `template-rules/final-quality-stamp-board/TEMPLATE.md`。
- 行动前提强调卡：用一个问题提示行动前的判断条件。规则见 `template-rules/action-prerequisite-card/TEMPLATE.md`。
- 章节过渡：包含黑报纸撕纸标题和黑白拼接旧报纸两种样式。规则见 `template-rules/chapter-transition/TEMPLATE.md`。
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

浏览完整 Playground：

```powershell
Set-Location playground
py -m http.server 4173 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:4173/index.html`。Playground 仅供查看和比较，不替代 `library.json` 的模板登记状态，也不是制作视频时必须让用户逐项确认的步骤。

预览 Remotion 工程：

```powershell
npm.cmd run studio
```

## 渲染验证

```powershell
npm.cmd run render:multi-03-torn
```

新增 `src/components` 公共组件与 `src/styles/brand.ts` 品牌样式。模板选择按 `family` 合并统计变体，先判断内容关系，再选择构图。
