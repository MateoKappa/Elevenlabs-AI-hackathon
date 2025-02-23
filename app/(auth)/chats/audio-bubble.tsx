import { useWavesurfer } from "@wavesurfer/react";
import { PauseCircle, PlayCircle } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

const AudioBubble = memo(({ isLoading, audioUrl, setIsFinished, setLocalAudioPosition }: { isLoading: boolean, audioUrl: string, setIsFinished: (isFinished: boolean) => void, setLocalAudioPosition: (localAudioPosition: number) => void }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [isDestroyed, setIsDestroyed] = useState(false);

	const { wavesurfer, isPlaying } = useWavesurfer({
		container: containerRef,
		height: 44,
		barGap: 2,
		barRadius: 4,
		barWidth: 3,
		barHeight: 1,
		waveColor: "#d1a0b5",
		progressColor: "#a3426c",
		cursorWidth: 0,
		interact: true,
		fillParent: true,
		hideScrollbar: true,
		url: audioUrl ?? undefined,
		// minPxPerSec: 50,
		backend: 'WebAudio'
	});

	const playPause = useCallback(() => {
		if (!wavesurfer || isDestroyed) return;
		if (isPlaying) wavesurfer.pause();
		else wavesurfer.play();
	}, [isPlaying, wavesurfer, isDestroyed]);

	useEffect(() => {
		if (!containerRef.current || !wavesurfer || isDestroyed) return;

		const handleInteraction = () => {
			if (!isDestroyed) {
				wavesurfer.play();
				setIsFinished(false);
			}
		};

		const handleAudioProcess = () => {
			if (!isDestroyed) {
				setLocalAudioPosition(wavesurfer.getCurrentTime());
			}
		};

		const handleFinish = () => {
			if (!isDestroyed) {
				wavesurfer.stop();
				setIsFinished(true);
			}
		};

		wavesurfer.on("interaction", handleInteraction);
		wavesurfer.on("audioprocess", handleAudioProcess);
		wavesurfer.on("finish", handleFinish);

		return () => {
			setIsDestroyed(true);
			wavesurfer.un("interaction", handleInteraction);
			wavesurfer.un("audioprocess", handleAudioProcess);
			wavesurfer.un("finish", handleFinish);
		};
	}, [wavesurfer, setIsFinished, setLocalAudioPosition, isDestroyed]);

	return (
		<div className="flex flex-row items-center gap-1 rounded-xl border-b w-full lg:min-w-[550px] px-3 py-1 text-sm">
			{isLoading ? (
				<div className="w-full h-11 rounded-full animate-pulse" />
			) : (
				<>
					<button
						className="shrink-0"
						type="button"
						onClick={playPause}
					>
						{isPlaying ? (
							<PauseCircle size={32} strokeWidth={1.5} />
						) : (
							<PlayCircle size={32} strokeWidth={1.5} />
						)}
					</button>
					<div className="ml-1 h-full w-full" ref={containerRef} />
				</>
			)}
		</div>
	)
}, (prevProps, nextProps) => {
	return prevProps.isLoading === nextProps.isLoading &&
		prevProps.audioUrl === nextProps.audioUrl;
	// We don't compare the function props since they should be stable
});

export default AudioBubble;