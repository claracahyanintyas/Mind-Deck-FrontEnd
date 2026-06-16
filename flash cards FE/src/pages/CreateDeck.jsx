import React, { useContext, useState } from 'react'
import DeckService from '../services/DeckService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
function CreateDeck() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(true); 
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    if (!user){
        navigate('/login')
        return;
      }
try{
        e.preventDefault(); 

        const newDeck = {
            name,
            description,
            isPrivate
        };
        const response = await DeckService.createDeck(newDeck); 
        toast.success("Success:", response.data);
        
        // 4. Navigate the user to their newly created deck
        navigate(`/decks/${response.data.id}`);
}
catch(error){
        if (error.response?.data?.errors) {
            const errorList = error.response.data.errors;

            errorList.forEach((err) => {
            // If 'err' is a string, use it. If it's an object, grab its 'defaultMessage'
            const message = typeof err === 'object' ? err.defaultMessage : err;
            
            toast.error(message || "Validation failed");
            });
        } else {
            toast.error("An unexpected error occurred.");
        }
}

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