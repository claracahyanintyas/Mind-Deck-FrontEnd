import React, { useContext, useState } from 'react'
import DeckService from '../services/DeckService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
function CreateDeck() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(true); 
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
    if (!user){
        navigate('/login')
        return;
      }

        e.preventDefault(); 

        const newDeck = {
            name,
            description,
            isPrivate
        };

        DeckService.createDeck(newDeck);       
        console.log(newDeck);
    };

    
    return (
        <div className='mx-auto'>
            Create your own deck here!
            <div className=''>
                <form onSubmit={handleSubmit} className='w-1/2 bg-[#BABDE2] text-left mx-auto rounded-sm'>
                    <div className=''>
                        <div className='flex flex-col'>
                            <label className='p-1'>Name</label>
                            <input 
                                className='m-1 bg-[#FFFCF5] rounded-sm px-1'
                                name='name'
                                value={name}
                                type='text'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='p-1'>Description</label>
                            <textarea 
                                className='m-1 bg-[#FFFCF5] rounded-sm px-1'
                                name='description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <label className='p-1'>Private</label>
                    <input 
                        type='checkbox' 
                        className='m-1'
                        name='isPrivate'
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />

                    <div className='p-2'>
                        <button 
                            type="submit" 
                            data-cy="submit-form"
                            className="bg-[#374375] text-[#FFFCF5] p-2 w-full rounded-md hover:bg-[#895159]"
                        >
                            Create Deck
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateDeck;