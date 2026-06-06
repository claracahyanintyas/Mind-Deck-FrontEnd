import React from 'react'
import { Link } from 'react-router-dom'

function DeckCard({deck}) {
  return (
    <div className="p-5 ">
      <div className="bg-[#BABDE2] flex flex-col center shadow-lg text-left py-2 px-4 text-lg items-center rounded-lg">
        <Link to={`/decks/${deck.id}`} className='underline hover:text-[#895159] p-2'>Deck {deck.id}: {deck.name}</Link>
        {/* <div className='flex items-center justify-center p-3'>
        </div> */}
        <p className='line-clamp-2 break-words leading-5 p-2 h-full'>{deck.description}</p>
        <Link className='bg-[#374375] text-[#BABDE2] w-full rounded-lg px-2 py-1 text-center hover:bg-[#DFAEA1] hover:text-[#895159]'>View</Link>
      </div>
    </div>
  )
}

export default DeckCard