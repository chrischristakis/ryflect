import { toast } from 'react-toastify';

export function handleError(err) {
    if(err.response && err.response.data && err.response.data.error) {
        if(Array.isArray(err.response.data.error)) {
            console.log('true!')
            for(const msg of err.response.data.error) 
                toast.error(msg, {position: 'top-center'});
        }
        else
            toast.error(err.response.data.error, {position: 'top-center'});
    }
    else
        toast.error('Something went wrong.', {position: 'top-center'});

    if(err.response && err.response.data && err.response.data.fields)
        return err.response.data.fields; // Return offending fields if they exist
}