import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export type ConceptExplainerRadialProps = {
  coreTitle: string;
  coreSubtitle: string;
  leftText: string;
  rightPrefix: string;
  rightHighlight: string;
  rightSuffix: string;
  bottomLine1: string;
  bottomLine2: string;
};

type Crop = {x: number; y: number; width: number; height: number};

const sheet = {width: 1672, height: 941};
const crops = {
  leftPlate: {x: 35, y: 8, width: 525, height: 345},
  corePlate: {x: 465, y: 70, width: 715, height: 415},
  rightPlate: {x: 1100, y: 4, width: 555, height: 405},
  bottomPlate: {x: 530, y: 445, width: 625, height: 300},
  leftArrow: {x: 160, y: 690, width: 360, height: 245},
  downArrow: {x: 735, y: 695, width: 200, height: 240},
  rightArrow: {x: 1180, y: 680, width: 380, height: 250},
} satisfies Record<string, Crop>;

const enter = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const Sprite: React.FC<{crop: Crop; width: number}> = ({crop, width}) => {
  const scale = width / crop.width;
  return (
    <div style={{position: 'relative', width, height: crop.height * scale, overflow: 'hidden'}}>
      <Img
        src={staticFile('assets/concept-radial-blank-sprites-v2.png')}
        style={{
          position: 'absolute',
          width: sheet.width * scale,
          height: sheet.height * scale,
          maxWidth: 'none',
          left: -crop.x * scale,
          top: -crop.y * scale,
        }}
      />
    </div>
  );
};

const Plate: React.FC<{
  crop: Crop;
  width: number;
  left: number;
  top: number;
  start: number;
  fromX?: number;
  fromY?: number;
  fromRotation?: number;
  children: React.ReactNode;
}> = ({crop, width, left, top, start, fromX = 0, fromY = 0, fromRotation = 0, children}) => {
  const frame = useCurrentFrame();
  const paperT = enter(frame, start, 18);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height: crop.height * width / crop.width,
        opacity: paperT,
        transform: `translate(${fromX * (1 - paperT)}px, ${fromY * (1 - paperT)}px) rotate(${fromRotation * (1 - paperT)}deg) scale(${0.92 + paperT * 0.08})`,
        transformOrigin: 'center',
      }}
    >
      <Sprite crop={crop} width={width} />
      {children}
    </div>
  );
};

const TextPop: React.FC<React.PropsWithChildren<{
  start: number;
  style: React.CSSProperties;
}>> = ({start, style, children}) => {
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
        fontFamily: 'Microsoft YaHei, sans-serif',
        fontWeight: 900,
        color: '#151412',
        opacity: t,
        transform: `scale(${0.72 + t * 0.28}) rotate(${1.2 * (1 - t)}deg)`,
        transformOrigin: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Arrow: React.FC<{
  crop: Crop;
  width: number;
  left: number;
  top: number;
  start: number;
  rotation?: number;
}> = ({crop, width, left, top, start, rotation = 0}) => {
  const frame = useCurrentFrame();
  const t = enter(frame, start, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        opacity: t,
        transform: `scale(${0.55 + t * 0.45}) rotate(${rotation}deg)`,
        transformOrigin: 'center',
      }}
    >
      <Sprite crop={crop} width={width} />
    </div>
  );
};

export const ConceptExplainerRadial: React.FC<ConceptExplainerRadialProps> = ({
  coreTitle,
  coreSubtitle,
  leftText,
  rightPrefix,
  rightHighlight,
  rightSuffix,
  bottomLine1,
  bottomLine2,
}) => (
  <AbsoluteFill style={{background: '#dedbd2', overflow: 'hidden'}}>
    <Img
      src={staticFile('assets/newspaper-neutral-v1.png')}
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill'}}
    />

    <Plate crop={crops.corePlate} width={805} left={558} top={286} start={4} fromY={-24} fromRotation={-1.2}>
      <TextPop
        start={13}
        style={{left: 125, top: 112, width: 550, height: 166, color: '#f1eadb', fontSize: 136, fontFamily: 'Arial Black, Impact, sans-serif', letterSpacing: -5}}
      >
        {coreTitle}
      </TextPop>
      <TextPop start={23} style={{left: 142, top: 267, width: 515, height: 90, fontSize: 54, letterSpacing: 1}}>
        {coreSubtitle}
      </TextPop>
    </Plate>

    <Plate crop={crops.leftPlate} width={610} left={42} top={72} start={39} fromX={-64} fromY={-14} fromRotation={-2}>
      <TextPop start={49} style={{left: 70, top: 91, width: 440, height: 145, fontSize: 70}}>
        {leftText}
      </TextPop>
    </Plate>
    <Arrow crop={crops.leftArrow} width={260} left={505} top={251} start={57} rotation={-4} />

    <Plate crop={crops.rightPlate} width={620} left={1256} top={68} start={61} fromX={66} fromY={-15} fromRotation={2}>
      <TextPop start={71} style={{left: 78, top: 101, width: 470, height: 142, fontSize: 57, whiteSpace: 'nowrap'}}>
        <span>{rightPrefix}</span><span style={{color: '#a83c23', fontSize: 76}}>{rightHighlight}</span><span>{rightSuffix}</span>
      </TextPop>
    </Plate>
    <Arrow crop={crops.rightArrow} width={260} left={1157} top={258} start={79} rotation={3} />

    <Plate crop={crops.bottomPlate} width={650} left={635} top={705} start={83} fromY={65} fromRotation={1.5}>
      <TextPop start={94} style={{left: 98, top: 78, width: 455, height: 150, fontSize: 54, lineHeight: 1.25, flexDirection: 'column'}}>
        <div>{bottomLine1}</div>
        <div>{bottomLine2}</div>
      </TextPop>
    </Plate>
    <Arrow crop={crops.downArrow} width={150} left={885} top={625} start={101} />
  </AbsoluteFill>
);
