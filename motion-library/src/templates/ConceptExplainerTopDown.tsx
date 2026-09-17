import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export type ConceptExplainerTopDownProps = {
  coreTitle: string;
  definition: string;
  leftPrefix: string;
  leftHighlight: string;
  leftSuffix: string;
  middleText: string;
  rightText: string;
};

type Crop = {x: number; y: number; width: number; height: number};

const sheets = {
  topdown: {file: 'assets/concept-topdown-blank-sprites-v2.png', width: 1672, height: 941},
  radial: {file: 'assets/concept-radial-blank-sprites-v2.png', width: 1672, height: 941},
};

const crops = {
  topTitle: {x: 315, y: 0, width: 1065, height: 440},
  definition: {x: 60, y: 430, width: 1560, height: 430},
  leftPlate: {x: 35, y: 8, width: 525, height: 345},
  middlePlate: {x: 530, y: 445, width: 625, height: 300},
  rightPlate: {x: 1100, y: 4, width: 555, height: 405},
  leftArrow: {x: 160, y: 690, width: 360, height: 245},
  downArrow: {x: 735, y: 695, width: 200, height: 240},
  rightArrow: {x: 1180, y: 680, width: 380, height: 250},
} satisfies Record<string, Crop>;

// Text is centered against the cream foreground paper, not the full collage bounds.
// Every reusable paper asset owns its measured text-safe area.
const textSafeAreas = {
  bottomLeft: {left: 45, top: 111, width: 405, height: 122},
  bottomMiddle: {left: 70, top: 94, width: 380, height: 108},
  bottomRight: {left: 44, top: 132, width: 412, height: 120},
} satisfies Record<string, React.CSSProperties>;

const enter = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const Sprite: React.FC<{crop: Crop; width: number; sheet: keyof typeof sheets}> = ({crop, width, sheet}) => {
  const source = sheets[sheet];
  const scale = width / crop.width;
  return (
    <div style={{position: 'relative', width, height: crop.height * scale, overflow: 'hidden'}}>
      <Img
        src={staticFile(source.file)}
        style={{
          position: 'absolute',
          width: source.width * scale,
          height: source.height * scale,
          maxWidth: 'none',
          left: -crop.x * scale,
          top: -crop.y * scale,
        }}
      />
    </div>
  );
};

const AnimatedPiece: React.FC<React.PropsWithChildren<{
  crop: Crop;
  sheet: keyof typeof sheets;
  width: number;
  left: number;
  top: number;
  start: number;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  fromRotation?: number;
}>> = ({crop, sheet, width, left, top, start, fromX = 0, fromY = 0, fromScale = 0.92, fromRotation = 0, children}) => {
  const frame = useCurrentFrame();
  const t = enter(frame, start, 18);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height: crop.height * width / crop.width,
        opacity: t,
        transform: `translate(${fromX * (1 - t)}px, ${fromY * (1 - t)}px) scale(${fromScale + (1 - fromScale) * t}) rotate(${fromRotation * (1 - t)}deg)`,
        transformOrigin: 'center',
      }}
    >
      <Sprite crop={crop} width={width} sheet={sheet} />
      {children}
    </div>
  );
};

const TextPop: React.FC<React.PropsWithChildren<{start: number; style: React.CSSProperties}>> = ({start, style, children}) => {
  const frame = useCurrentFrame();
  const t = enter(frame, start, 12);
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#151412',
        fontFamily: 'Microsoft YaHei, sans-serif',
        fontWeight: 900,
        opacity: t,
        transform: `scale(${0.74 + 0.26 * t})`,
        transformOrigin: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const ConceptExplainerTopDown: React.FC<ConceptExplainerTopDownProps> = ({
  coreTitle,
  definition,
  leftPrefix,
  leftHighlight,
  leftSuffix,
  middleText,
  rightText,
}) => (
  <AbsoluteFill style={{background: '#dedbd2', overflow: 'hidden'}}>
    <Img
      src={staticFile('assets/newspaper-neutral-v1.png')}
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill'}}
    />

    <AnimatedPiece crop={crops.topTitle} sheet="topdown" width={900} left={510} top={20} start={4} fromY={-45} fromRotation={-1.3}>
      <TextPop
        start={13}
        style={{left: 140, top: 94, width: 625, height: 160, color: '#f1eadb', fontFamily: 'Arial Black, Impact, sans-serif', fontSize: 132, letterSpacing: -5}}
      >
        {coreTitle}
      </TextPop>
    </AnimatedPiece>

    <AnimatedPiece crop={crops.downArrow} sheet="radial" width={100} left={910} top={310} start={27} fromScale={0.55} />

    <AnimatedPiece crop={crops.definition} sheet="topdown" width={1320} left={300} top={365} start={35} fromY={20} fromRotation={0.8}>
      <TextPop start={45} style={{left: 140, top: 96, width: 1040, height: 148, fontSize: 68, letterSpacing: -1}}>
        {definition}
      </TextPop>
    </AnimatedPiece>

    <AnimatedPiece crop={crops.rightArrow} sheet="radial" width={220} left={385} top={585} start={62} fromScale={0.55} fromRotation={-2} />
    <AnimatedPiece crop={crops.downArrow} sheet="radial" width={105} left={907} top={600} start={65} fromScale={0.55} />
    <AnimatedPiece crop={crops.leftArrow} sheet="radial" width={220} left={1315} top={585} start={68} fromScale={0.55} fromRotation={2} />

    <AnimatedPiece crop={crops.leftPlate} sheet="radial" width={500} left={45} top={700} start={72} fromX={-42} fromY={38} fromRotation={-1.5}>
      <TextPop start={82} style={{...textSafeAreas.bottomLeft, fontSize: 44, whiteSpace: 'nowrap'}}>
        <span>{leftPrefix}</span><span style={{color: '#a83c23', fontSize: 63}}>{leftHighlight}</span><span>{leftSuffix}</span>
      </TextPop>
    </AnimatedPiece>

    <AnimatedPiece crop={crops.middlePlate} sheet="radial" width={520} left={700} top={735} start={79} fromY={48} fromRotation={1.2}>
      <TextPop start={89} style={{...textSafeAreas.bottomMiddle, fontSize: 48, whiteSpace: 'nowrap'}}>
        {middleText}
      </TextPop>
    </AnimatedPiece>

    <AnimatedPiece crop={crops.rightPlate} sheet="radial" width={500} left={1370} top={680} start={86} fromX={40} fromY={40} fromRotation={1.6}>
      <TextPop start={96} style={{...textSafeAreas.bottomRight, fontSize: 44, whiteSpace: 'nowrap'}}>
        {rightText}
      </TextPop>
    </AnimatedPiece>
  </AbsoluteFill>
);
