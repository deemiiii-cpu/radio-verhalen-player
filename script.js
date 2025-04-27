import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://grumsinwfuekqndldunj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...etc' // Use your key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function fetchTracks() {
  const { data, error } = await supabase
    .storage
    .from('audio-uploads') // Use your bucket name
    .list('', {
      limit: 10,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (error) {
    console.error(error)
    return []
  }

  return data.map(file => supabase.storage.from('audio-uploads').getPublicUrl(file.name).publicUrl)
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

async function startPlayer() {
  const urls = await fetchTracks()
  shuffle(urls)
  
  let index = 0
  const audio = document.getElementById('player')

  function playNext() {
    if (index >= urls.length) {
      index = 0
      shuffle(urls)
    }
    audio.src = urls[index]
    audio.play()
    index++
  }

  audio.addEventListener('ended', playNext)

  playNext()
}

startPlayer()
