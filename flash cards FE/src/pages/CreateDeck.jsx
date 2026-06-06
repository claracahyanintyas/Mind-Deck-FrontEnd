import React, { useState } from 'react'

function CreateDeck() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);

        const handleSubmit = (e) => {
        e.preventDefault();

        const newDeck = {
            title,
            description,
            isPrivate
        };

        console.log(newDeck);
    };
  return (
    <div className='mx-auto'>
        Create your own deck here!
        <div className=''>
            <form className='w-1/2 bg-[#BABDE2] text-left mx-auto rounded-sm'>
                <div className=''>
                    <div className='flex flex-col'>
                        <label className='p-1'>Name</label>
                        <input className='m-1 bg-[#FFFCF5] rounded-sm px-1'
                        name='title'
                        value={title}
                        type='text'
                        onChange={(e) => setTitle(e.target.value)}></input>
                    </div>
                    <div className='flex flex-col'>
                        <label className='p-1'>Description</label>
                        <textarea className='m-1 bg-[#FFFCF5] rounded-sm px-1'
                            type='text'
                            name='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.checked)}></textarea>
                    </div>

                </div>

                <label className='p-1'>Private</label>
                <input type='checkbox' checked
                className='m-1'
                name='isPrivate'
                value={isPrivate}
                onChange={(e) => setIsPrivate(e.target.value)}
                ></input>
                <div className='p-2'>
                    <button type="submit" 
                        data-cy="submit-form"
                        className="bg-[#374375] text-[#FFFCF5] p-2 w-full rounded-md hover:bg-[#895159]">Create Deck</button>
                </div>
                                
            </form>
        </div>
    </div>
  )
}

export default CreateDeck