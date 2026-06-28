import { Composition } from 'remotion';
import { BlastRadiusScene } from './BlastRadiusScene';
import '../index.css';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="BlastRadiusScene"
        component={BlastRadiusScene}
        durationInFrames={120}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
