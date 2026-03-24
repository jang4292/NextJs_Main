"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Track = {
	id: string;
	bpm: number;
	title: string;
	artist: string;
	genre: string;
	src: string;
	/** true when the src is a local Object URL that we own and must revoke */
	isObjectUrl?: boolean;
};

// ---------------------------------------------------------------------------
// Default playlist
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function formatTime(sec: number): string {
	if (!sec || !isFinite(sec)) return "0:00";
	const m = Math.floor(sec / 60);
	const s = Math.floor(sec % 60).toString().padStart(2, "0");
	return `${m}:${s}`;
}

// Use crypto.randomUUID for collision-free IDs; fall back to a simple counter on servers
// that don't expose the Web Crypto API.
function uid(): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}
	return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function DJPlayListPage() {
	const [tracks, setTracks] = useState<Track[]>(SAMPLE_TRACKS);
	const [currentId, setCurrentId] = useState<string | null>(null);
	const [playing, setPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [repeat, setRepeat] = useState(false);
	const [shuffle, setShuffle] = useState(false);

	// URL-add form state
	const [urlInput, setUrlInput] = useState("");
	const [urlTitle, setUrlTitle] = useState("");
	const [urlArtist, setUrlArtist] = useState("");
	const [urlError, setUrlError] = useState("");

	const audioRef = useRef<HTMLAudioElement | null>(null);
	// Keep a live ref to tracks so the unmount cleanup can revoke all remaining Object URLs.
	const tracksRef = useRef(tracks);
	useEffect(() => { tracksRef.current = tracks; }, [tracks]);

	const current = tracks.find((t) => t.id === currentId) ?? null;
	const currentIndex = tracks.findIndex((t) => t.id === currentId);

	// ---- Revoke Object URLs on unmount to prevent memory leaks ----
	useEffect(() => {
		return () => {
			tracksRef.current.forEach((t) => {
				if (t.isObjectUrl) URL.revokeObjectURL(t.src);
			});
		};
	}, []);

	// ---- Audio event listeners (mount once) ----
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const onTime = () => {
			setCurrentTime(audio.currentTime);
		};
		const onLoaded = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
		const onEnded = () => {
			if (repeat) {
				audio.currentTime = 0;
				audio.play().catch(() => setPlaying(false));
			} else {
				handleNext(true /* auto */);
			}
		};
		const onError = () => setPlaying(false);

		audio.addEventListener("timeupdate", onTime);
		audio.addEventListener("loadedmetadata", onLoaded);
		audio.addEventListener("ended", onEnded);
		audio.addEventListener("error", onError);

		return () => {
			audio.removeEventListener("timeupdate", onTime);
			audio.removeEventListener("loadedmetadata", onLoaded);
			audio.removeEventListener("ended", onEnded);
			audio.removeEventListener("error", onError);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [repeat, shuffle, tracks]);

	// ---- Load track when currentId changes ----
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (current) {
			audio.src = current.src;
			audio.load();
			setCurrentTime(0);
			setDuration(0);
		} else {
			audio.pause();
			audio.src = "";
		}
	}, [current]);

	// ---- Play / pause based on `playing` state ----
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !current) return;
		if (playing) {
			audio.play().catch(() => setPlaying(false));
		} else {
			audio.pause();
		}
	}, [playing, current]);

	// ---- Sync volume ----
	useEffect(() => {
		if (audioRef.current) audioRef.current.volume = volume;
	}, [volume]);

	// ---- Navigation helpers ----
	function handleNext(auto = false) {
		if (tracks.length === 0) return;
		let nextIndex: number;
		if (shuffle) {
			nextIndex = Math.floor(Math.random() * tracks.length);
		} else {
			nextIndex = currentIndex + 1;
			if (nextIndex >= tracks.length) {
				if (auto && !repeat) {
					setPlaying(false);
					return;
				}
				nextIndex = 0;
			}
		}
		setCurrentId(tracks[nextIndex].id);
		setPlaying(true);
	}

	function handlePrev() {
		if (tracks.length === 0) return;
		const audio = audioRef.current;
		// If more than 3 s into the track, restart from beginning
		if (audio && audio.currentTime > 3) {
			audio.currentTime = 0;
			return;
		}
		let prevIndex = currentIndex - 1;
		if (prevIndex < 0) prevIndex = tracks.length - 1;
		setCurrentId(tracks[prevIndex].id);
		setPlaying(true);
	}

	function handleSelectTrack(t: Track) {
		if (currentId === t.id) {
			setPlaying((p) => !p);
		} else {
			setCurrentId(t.id);
			setPlaying(true);
		}
	}

	function handleStop() {
		setPlaying(false);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		setCurrentTime(0);
	}

	function handleRemoveTrack(id: string) {
		setTracks((prev) => {
			const t = prev.find((x) => x.id === id);
			if (t?.isObjectUrl) URL.revokeObjectURL(t.src);
			return prev.filter((x) => x.id !== id);
		});
		if (currentId === id) {
			handleStop();
			setCurrentId(null);
		}
	}

	// ---- Local file upload ----
	function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? []);
		const newTracks: Track[] = files.map((file) => ({
			id: uid(),
			bpm: 0,
			title: file.name.replace(/\.[^/.]+$/, ""),
			artist: "Local File",
			genre: "Local",
			src: URL.createObjectURL(file),
			isObjectUrl: true,
		}));
		setTracks((prev) => [...prev, ...newTracks]);
		// Reset file input so the same file can be re-added
		e.target.value = "";
	}

	// ---- URL-based track addition ----
	function handleAddUrl(e: React.FormEvent) {
		e.preventDefault();
		setUrlError("");
		const trimmed = urlInput.trim();
		if (!trimmed) {
			setUrlError("URL을 입력하세요. / Please enter a URL.");
			return;
		}
		try {
			const parsed = new URL(trimmed);
			if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
				setUrlError("http 또는 https URL만 허용됩니다. / Only http/https URLs are allowed.");
				return;
			}
		} catch {
			setUrlError("올바른 URL 형식이 아닙니다. / Invalid URL format.");
			return;
		}
		setTracks((prev) => [
			...prev,
			{
				id: uid(),
				bpm: 0,
				title: urlTitle.trim() || trimmed,
				artist: urlArtist.trim() || "Unknown",
				genre: "URL",
				src: trimmed,
			},
		]);
		setUrlInput("");
		setUrlTitle("");
		setUrlArtist("");
	}

	// ---- Render ----

	return (
		<div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
			<h1 className="text-2xl font-bold">🎵 DJ Play List</h1>

			{/* ── Player ── */}
			<div className="bg-gray-50 border rounded-xl p-4 space-y-3 shadow-sm">
				{/* Track info */}
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0">
						<p className="font-semibold truncate text-lg">
							{current ? current.title : "No track selected"}
						</p>
						<p className="text-sm text-gray-500 truncate">
							{current
								? `${current.artist}${current.bpm ? ` • BPM ${current.bpm}` : ""} • ${current.genre}`
								: "—"}
						</p>
					</div>
					{/* Repeat / Shuffle toggles */}
					<div className="flex gap-1 shrink-0 mt-1">
						<button
							onClick={() => setRepeat((r) => !r)}
							title={repeat ? "Repeat ON" : "Repeat OFF"}
							className={`px-2 py-1 text-xs rounded border ${repeat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}
						>
							🔁
						</button>
						<button
							onClick={() => setShuffle((s) => !s)}
							title={shuffle ? "Shuffle ON" : "Shuffle OFF"}
							className={`px-2 py-1 text-xs rounded border ${shuffle ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}
						>
							🔀
						</button>
					</div>
				</div>

				{/* SeekBar */}
				<div className="space-y-1">
					<input
						type="range"
						min={0}
						max={duration || 0}
						step={0.1}
						value={currentTime}
						onChange={(e) => {
							const val = Number(e.target.value);
							setCurrentTime(val);
							if (audioRef.current && duration > 0) {
								audioRef.current.currentTime = val;
							}
						}}
						className="w-full accent-blue-600 cursor-pointer"
						aria-label="Seek"
					/>
					<div className="flex justify-between text-xs text-gray-500 select-none">
						<span>{formatTime(currentTime)}</span>
						<span>{formatTime(duration)}</span>
					</div>
				</div>

				{/* Transport controls */}
				<div className="flex items-center justify-center gap-3">
					<button
						onClick={handlePrev}
						disabled={!current}
						className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
						title="Previous"
						aria-label="Previous track"
					>
						⏮
					</button>
					<button
						onClick={() => {
							if (!current && tracks.length > 0) {
								setCurrentId(tracks[0].id);
								setPlaying(true);
							} else {
								setPlaying((p) => !p);
							}
						}}
						disabled={tracks.length === 0}
						className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 text-lg"
						title={playing ? "Pause" : "Play"}
						aria-label={playing ? "Pause" : "Play"}
					>
						{playing ? "⏸" : "▶️"}
					</button>
					<button
						onClick={handleStop}
						disabled={!current}
						className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
						title="Stop"
						aria-label="Stop"
					>
						⏹
					</button>
					<button
						onClick={() => handleNext(false)}
						disabled={!current}
						className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
						title="Next"
						aria-label="Next track"
					>
						⏭
					</button>
				</div>

				{/* Volume */}
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-500 w-6 text-center">
						{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
					</span>
					<input
						type="range"
						min={0}
						max={1}
						step={0.01}
						value={volume}
						onChange={(e) => setVolume(Number(e.target.value))}
						className="flex-1 accent-blue-600 cursor-pointer"
						aria-label="Volume"
					/>
					<span className="text-xs text-gray-500 w-8 text-right">{Math.round(volume * 100)}%</span>
				</div>
			</div>

			{/* ── Add via URL ── */}
			<section className="border rounded-xl p-4 space-y-2">
				<h2 className="font-semibold text-sm text-gray-700">🌐 URL로 트랙 추가 / Add track via URL</h2>
				<form onSubmit={handleAddUrl} className="space-y-2">
					<input
						type="url"
						placeholder="Audio URL (https://...)"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
					<div className="flex gap-2">
						<input
							type="text"
							placeholder="Title (optional)"
							value={urlTitle}
							onChange={(e) => setUrlTitle(e.target.value)}
							className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
						<input
							type="text"
							placeholder="Artist (optional)"
							value={urlArtist}
							onChange={(e) => setUrlArtist(e.target.value)}
							className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
					{urlError && <p className="text-xs text-red-500">{urlError}</p>}
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
					>
						추가 / Add
					</button>
				</form>
			</section>

			{/* ── Add Local File ── */}
			<section className="border rounded-xl p-4 space-y-2">
				<h2 className="font-semibold text-sm text-gray-700">📁 로컬 파일 추가 / Add local files</h2>
				<label className="flex items-center gap-3 cursor-pointer">
					<span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm border">
						파일 선택 / Choose files
					</span>
					<span className="text-xs text-gray-500">MP3, FLAC, WAV, OGG, AAC 등 지원</span>
					<input
						type="file"
						accept="audio/*"
						multiple
						onChange={handleFileUpload}
						className="sr-only"
					/>
				</label>
			</section>

			{/* ── Playlist ── */}
			<section className="border rounded-xl overflow-hidden">
				<h2 className="px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700 border-b">
					🎶 재생 목록 / Playlist ({tracks.length})
				</h2>
				{tracks.length === 0 ? (
					<p className="px-4 py-6 text-sm text-gray-400 text-center">
						재생 목록이 비어 있습니다. / Playlist is empty.
					</p>
				) : (
					<ul className="divide-y max-h-80 overflow-y-auto">
						{tracks.map((t, idx) => {
							const isActive = t.id === currentId;
							return (
								<li
									key={t.id}
									className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
									onClick={() => handleSelectTrack(t)}
								>
									{/* Index / playing indicator */}
									<span className="w-5 text-center text-xs text-gray-400 shrink-0">
										{isActive && playing ? "▶" : idx + 1}
									</span>
									{/* Info */}
									<div className="flex-1 min-w-0">
										<p className={`text-sm truncate font-medium ${isActive ? "text-blue-700" : ""}`}>
											{t.title}
										</p>
										<p className="text-xs text-gray-400 truncate">
											{t.artist}
											{t.bpm ? ` • BPM ${t.bpm}` : ""}
											{t.genre ? ` • ${t.genre}` : ""}
										</p>
									</div>
									{/* Remove button */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleRemoveTrack(t.id);
										}}
										className="text-gray-300 hover:text-red-500 text-xs px-1"
										aria-label={`Remove ${t.title}`}
									>
										✕
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</section>

			<audio ref={audioRef} />
		</div>
	);
}
