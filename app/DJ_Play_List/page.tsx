"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

type Track = { id: string; bpm: number; title: string; artist: string; genre: string; src: string };

const SAMPLE_TRACKS: Track[] = [
	{
		id: "1",
		bpm: 200,
		title: "Non Stop Flight",
		artist: "Artie Shaw",
		genre: "Swing Jazz - Balboa",
		src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B200%5D+Artie+Shaw+-+Non+Stop+Flight.flac",
	},
	{
		id: "2",
		bpm: 195,
		title: "Little Brown Jug",
		artist: "Hot Sugar Band",
		genre: "Swing Jazz - Balboa",
		src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B195%5D+Hot+Sugar+Band+-+Little+Brown+Jug.mp3",
	},
	{
		id: "3",
		bpm: 198,
		title: "Georgianna",
		artist: "Naomi & Her Handsome Devils",
		genre: "Swing Jazz - Balboa",
		src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B198%5D+Naomi+%26+Her+Handsome+Devils+-+Georgianna.mp3",
	},
    {
		id: "4",
		bpm: 195,
		title: "Sugar Foot Stomp",
		artist: "Benny Goodman",
		genre: "Swing Jazz - Balboa",
		src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B195%5D+Benny+Goodman+-+Sugar+Foot+Stomp.mp3",
	},
    {
		id: "5",
		bpm: 200,
		title: "It Don't Mean a Thing",
		artist: "Hop's Trio",
		genre: "Swing Jazz - Balboa",
		src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B200%5D+Hop's+Trio+-+It+Don't+Mean+a+Thing.mp3",
	},
    {
		id: "6",
		bpm: 240,
		title: "Jumpin at The Woodside",
		artist: "Count Basie",
		genre: "Swing Jazz - Balboa",
		src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B240%5D+Count+Basie+-+Jumpin+at+The+Woodside.mp3",
	},

];

export default function DJPlayListPage() {
	const [tracks] = useState<Track[]>(SAMPLE_TRACKS);
	const [current, setCurrent] = useState<Track | null>(null);
	const [playing, setPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const onTime = () => setCurrentTime(audio.currentTime || 0);
		const onLoaded = () => setDuration(audio.duration || 0);
		const onEnd = () => setPlaying(false);
		audio.addEventListener("timeupdate", onTime);
		audio.addEventListener("loadedmetadata", onLoaded);
		audio.addEventListener("ended", onEnd);
		return () => {
			audio.removeEventListener("timeupdate", onTime);
			audio.removeEventListener("loadedmetadata", onLoaded);
			audio.removeEventListener("ended", onEnd);
		};
	}, []);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (current) {
			audio.src = current.src;
			audio.load();
			if (playing) audio.play().catch(() => setPlaying(false));
		} else {
			audio.pause();
			audio.src = "";
		}
	}, [current, playing]);

	function handlePlay(t: Track) {
		if (current?.id !== t.id) setCurrent(t);
		setPlaying(true);
	}
	function handlePause() {
		setPlaying(false);
	}
	function handleStop() {
		setPlaying(false);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">DJ Play List</h1>
			<div className="sticky top-0 bg-white p-3 border-b">
				<div className="flex justify-between items-center">
					<div>{current ? `${current.title} — ${current.artist}` : "No track"}</div>
					<div className="flex gap-2">
						<button onClick={() => current && setPlaying(true)} className="px-2 py-1 bg-blue-600 text-white rounded">
							Play
						</button>
						<button onClick={handlePause} className="px-2 py-1 bg-yellow-400 rounded">
							Pause
						</button>
						<button onClick={handleStop} className="px-2 py-1 bg-gray-200 rounded">
							Stop
						</button>
					</div>
				</div>
				<div className="mt-2 text-sm text-gray-600">
					{formatTime(currentTime)} / {formatTime(duration)}
				</div>
				<div
					className="w-full h-3 bg-gray-200 rounded mt-2"
					onClick={(e: MouseEvent<HTMLDivElement>) => {
							const el = e.currentTarget as HTMLDivElement;
							const rect = el.getBoundingClientRect();
							const pct = Math.max(0, Math.min(1, e.clientX - rect.left) / rect.width);
							if (audioRef.current && duration > 0) audioRef.current.currentTime = pct * duration;
						}}
				>
					<div
						className="h-3 bg-blue-600 rounded"
						style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
					/>
				</div>
			</div>

			<div className="max-h-[50vh] overflow-y-auto mt-4 space-y-2">
				{tracks.map((t) => (
					<div key={t.id} className="flex justify-between items-center p-2 border rounded">
						<div>
							<div className="font-semibold">{t.title}</div>
							<div className="text-sm text-gray-600">
								{t.artist} • BPM: {t.bpm} • {t.genre}
							</div>
						</div>
						<div className="flex gap-2">
							<button onClick={() => handlePlay(t)} className="px-2 py-1 bg-blue-600 text-white rounded">
								Play
							</button>
							<button onClick={handleStop} className="px-2 py-1 bg-gray-200 rounded">
								Stop
							</button>
						</div>
					</div>
				))}
			</div>

			<audio ref={audioRef} />
		</div>
	);
}

function formatTime(sec: number) {
	if (!sec || !isFinite(sec)) return "0:00";
	const m = Math.floor(sec / 60);
	const s = Math.floor(sec % 60).toString().padStart(2, "0");
	return `${m}:${s}`;
}


