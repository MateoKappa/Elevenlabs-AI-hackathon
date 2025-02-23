import { memo, useCallback } from "react";

const CHARS_PER_SECOND = 14.5;
const StreamingText = memo(({ ownMessage, audioUrl, content, isFinished, localAudioPosition }: { ownMessage: boolean, audioUrl: string | null, content: string | null, isFinished: boolean, localAudioPosition: number }) => {

	const renderStreamingText = useCallback(() => {
		if (isFinished) return <span className="whitespace-pre-wrap">{content}</span>;

		const currentPosition = Math.floor(localAudioPosition * CHARS_PER_SECOND);
		return (
			<span className="whitespace-pre-wrap">
				{content?.slice(0, currentPosition)}
			</span>
		);
	}, [isFinished, localAudioPosition, content]);

	return (
		<>
			{ownMessage || !audioUrl
				? content
				: renderStreamingText()}
		</>
	)
})

export default StreamingText;