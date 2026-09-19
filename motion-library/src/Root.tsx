import React from 'react';
import {Composition} from 'remotion';
import {MultiPointTornList} from './templates/MultiPointTornList';
import {MultiPointStaggeredMemo} from './templates/MultiPointStaggeredMemo';
import {MultiPointStampLabel} from './templates/MultiPointStampLabel';
import {MultiPointIndexTabs} from './templates/MultiPointIndexTabs';
import {MultiPointBurstStickers} from './templates/MultiPointBurstStickers';
import {ProcessFlow} from './templates/ProcessFlow';
import {BeforeAfterCompare} from './templates/BeforeAfterCompare';
import {ConceptExplainerRadial} from './templates/ConceptExplainerRadial';
import {ConceptExplainerTopDown} from './templates/ConceptExplainerTopDown';
import {KeyConclusion} from './templates/KeyConclusion';
import {KeyConclusionEditorialCollage} from './templates/KeyConclusionEditorialCollage';
import {ScreenRecordingTransition} from './templates/ScreenRecordingTransition';
import {TimelineEvents} from './templates/TimelineEvents';
import {CostAccumulation} from './templates/CostAccumulation';
import {OpposingTrends} from './templates/OpposingTrends';
import {OrderHierarchy} from './templates/OrderHierarchy';
import {multiPoint03} from './presets';

export const Root: React.FC = () => (
  <>
    <Composition id="OrderHierarchy" component={OrderHierarchy}
      durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{}} />
    <Composition id="OpposingTrends" component={OpposingTrends}
      durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{}} />
    <Composition id="CostAccumulation" component={CostAccumulation}
      durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={{}} />
    <Composition
      id="MultiPointTorn03"
      component={MultiPointTornList}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={multiPoint03}
    />
    <Composition
      id="MultiPointStaggeredMemo"
      component={MultiPointStaggeredMemo}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        items: [
          {text: '确定选题', icon: 'magnifier' as const},
          {text: '准备逐字稿', icon: 'keyboard' as const},
          {text: '生成配音', icon: 'play' as const},
        ],
      }}
    />
    <Composition
      id="MultiPointStampLabel"
      component={MultiPointStampLabel}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        items: [
          {text: '确定选题'},
          {text: '准备逐字稿'},
          {text: '生成配音'},
        ],
      }}
    />
    <Composition
      id="MultiPointIndexTabs"
      component={MultiPointIndexTabs}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        items: [
          {text: '分析音频'},
          {text: '拆解分镜'},
          {text: '准备录屏'},
          {text: '生成成片'},
        ],
      }}
    />
    <Composition
      id="MultiPointBurstStickers"
      component={MultiPointBurstStickers}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        items: [
          {text: '选题'},
          {text: '文稿'},
          {text: '配音'},
          {text: '分镜'},
          {text: '成片'},
        ],
      }}
    />
    <Composition
      id="ProcessFlowZigzag"
      component={ProcessFlow}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{steps: ['第一步', '第二步', '第三步'], variant: 'zigzag'}}
    />
    <Composition
      id="ProcessFlowJourney"
      component={ProcessFlow}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{steps: ['第一步', '第二步', '第三步'], variant: 'journey'}}
    />
    <Composition
      id="BeforeAfterCompare"
      component={BeforeAfterCompare}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{beforeTitle: '改变前', beforeText: '内容示例', afterTitle: '改变后', afterText: '内容示例'}}
    />
    <Composition
      id="ConceptExplainerRadialGithub"
      component={ConceptExplainerRadial}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        coreTitle: 'GitHub',
        coreSubtitle: '全球开源项目平台',
        leftText: '不只是程序员',
        rightPrefix: '超过',
        rightHighlight: '1.8亿',
        rightSuffix: '用户',
        bottomLine1: '免费开放',
        bottomLine2: '不会代码也能用',
      }}
    />
    <Composition
      id="ConceptExplainerTopDownGithub"
      component={ConceptExplainerTopDown}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        coreTitle: 'GitHub',
        definition: '全球开源代码和项目托管平台',
        leftPrefix: '超过',
        leftHighlight: '1.8亿',
        leftSuffix: '用户',
        middleText: '资源免费开放',
        rightText: '不会代码也能用',
      }}
    />
    <Composition
      id="KeyConclusion"
      component={KeyConclusion}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        label: '重点结论',
        firstPart: '先有音频',
        secondPart: '再定时长',
      }}
    />
    <Composition
      id="KeyConclusionEditorialCollage"
      component={KeyConclusionEditorialCollage}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        label: '重点结论',
        firstPart: '先做出结果',
        secondPart: '再慢慢优化',
        note: '别等完美，边做边改更快。',
      }}
    />
    <Composition
      id="ScreenRecordingTransition"
      component={ScreenRecordingTransition}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: '来看实际操作',
        videoSrc: 'samples/0913-3.mp4',
        videoWidth: 1658,
        videoHeight: 1080,
        icon: 'cursor' as const,
      }}
    />
    <Composition
      id="TimelineEvents"
      component={TimelineEvents}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        events: [
          {time: '交片后', title: '开始催款', illustration: 'delivery' as const},
          {time: '年初', title: '反复沟通', illustration: 'calendar' as const},
          {time: '年中', title: '继续拖延', illustration: 'waiting' as const},
          {time: '6月', title: '彻底失联', illustration: 'disconnected' as const},
        ],
      }}
    />
  </>
);
