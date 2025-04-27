import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://grumsinwfuekqndldunj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydW1zaW53ZnVla3FuZGxkdW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzU1MTAsImV4cCI6MjA2MTE1MTUxMH0.fRi83KSLnP-pOgBpQOqGy4IR0392VPawdSQcTIR3zkM';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let tracks = [];
let currentTrackIndex = 0;
const audio = document.getElementById('audioPlayer');

// Fetch the list of tracks from Supabase
async function fetchTracks() {
  const { data, error } = await supabase
    .storage
    .from('audio-uploads')
    .list('', { limit: 10, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) {
    console.error('Error fetching tracks:', error);
    return;
  }

  tracks = data.map(file => `${SUPABASE_URL}/storage/v1/object/public/audio-uploads/${file.name}`);
  
  if (tracks.length > 0) {
    shuffleArray(tracks);
    playTrack(currentTrackIndex);
  }
}

// Shuffle the tracks
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Play a specific track
function playTrack(index) {
  if (tracks.length === 0) return;

  audio.src = tracks[index];
  audio.play();
}

// When the current track ends, play the next one
audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  playTrack(currentTrackIndex);
});

// Start everything
fetchTracks();

// Optionally, refresh track list every 10 seconds to get new uploads
setInterval(fetchTracks, 10000);
