export type Track = {
  id: string;
  number: number;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  src: string;
};

export type Playlist = {
  date: string; // YYYY-MM-DD
  label: string;
  description: string;
  tracks: Track[];
};

export const PLAYLISTS: Playlist[] = [
  {
    date: "2025-01-10",
    label: "2025년 1월 10일",
    description: "Balboa / Swing Jazz 입문 세션",
    tracks: [
      {
        id: "1-1",
        number: 1,
        title: "Non Stop Flight",
        artist: "Artie Shaw",
        bpm: 200,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B200%5D+Artie+Shaw+-+Non+Stop+Flight.flac",
      },
      {
        id: "1-2",
        number: 2,
        title: "Little Brown Jug",
        artist: "Hot Sugar Band",
        bpm: 195,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B195%5D+Hot+Sugar+Band+-+Little+Brown+Jug.mp3",
      },
      {
        id: "1-3",
        number: 3,
        title: "Georgianna",
        artist: "Naomi & Her Handsome Devils",
        bpm: 198,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B198%5D+Naomi+%26+Her+Handsome+Devils+-+Georgianna.mp3",
      },
      {
        id: "1-4",
        number: 4,
        title: "Sugar Foot Stomp",
        artist: "Benny Goodman",
        bpm: 195,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B195%5D+Benny+Goodman+-+Sugar+Foot+Stomp.mp3",
      },
      {
        id: "1-5",
        number: 5,
        title: "It Don't Mean a Thing",
        artist: "Hop's Trio",
        bpm: 200,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B200%5D+Hop's+Trio+-+It+Don't+Mean+a+Thing.mp3",
      },
      {
        id: "1-6",
        number: 6,
        title: "Jumpin at The Woodside",
        artist: "Count Basie",
        bpm: 240,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B240%5D+Count+Basie+-+Jumpin+at+The+Woodside.mp3",
      },
    ],
  },
  {
    date: "2025-02-14",
    label: "2025년 2월 14일",
    description: "Valentine's Day 특집 - 낭만 스윙 세션",
    tracks: [
      {
        id: "2-1",
        number: 1,
        title: "Little Brown Jug",
        artist: "Hot Sugar Band",
        bpm: 195,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B195%5D+Hot+Sugar+Band+-+Little+Brown+Jug.mp3",
      },
      {
        id: "2-2",
        number: 2,
        title: "It Don't Mean a Thing",
        artist: "Hop's Trio",
        bpm: 200,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B200%5D+Hop's+Trio+-+It+Don't+Mean+a+Thing.mp3",
      },
      {
        id: "2-3",
        number: 3,
        title: "Georgianna",
        artist: "Naomi & Her Handsome Devils",
        bpm: 198,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B198%5D+Naomi+%26+Her+Handsome+Devils+-+Georgianna.mp3",
      },
    ],
  },
  {
    date: "2025-03-01",
    label: "2025년 3월 1일",
    description: "삼일절 기념 - 클래식 스윙 세션",
    tracks: [
      {
        id: "3-1",
        number: 1,
        title: "Sugar Foot Stomp",
        artist: "Benny Goodman",
        bpm: 195,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B195%5D+Benny+Goodman+-+Sugar+Foot+Stomp.mp3",
      },
      {
        id: "3-2",
        number: 2,
        title: "Jumpin at The Woodside",
        artist: "Count Basie",
        bpm: 240,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B240%5D+Count+Basie+-+Jumpin+at+The+Woodside.mp3",
      },
      {
        id: "3-3",
        number: 3,
        title: "Non Stop Flight",
        artist: "Artie Shaw",
        bpm: 200,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B200%5D+Artie+Shaw+-+Non+Stop+Flight.flac",
      },
      {
        id: "3-4",
        number: 4,
        title: "Little Brown Jug",
        artist: "Hot Sugar Band",
        bpm: 195,
        genre: "Swing Jazz - Balboa",
        src: "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com/SwingJazz/%5B195%5D+Hot+Sugar+Band+-+Little+Brown+Jug.mp3",
      },
    ],
  },
];

export function getPlaylistByDate(date: string): Playlist | undefined {
  return PLAYLISTS.find((p) => p.date === date);
}

export function getAllDates(): string[] {
  return PLAYLISTS.map((p) => p.date);
}
