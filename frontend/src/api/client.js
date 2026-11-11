export async function searchRoommates({ current_user_id, filters = {}, mode = 'AND', page = 1 }) {
  const response = await fetch('http://localhost:8000/search-roommates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_user_id,
      filters,
      mode,
      page,
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to search roommate profiles')
  }

  return response.json()
}
