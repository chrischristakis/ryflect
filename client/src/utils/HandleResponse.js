import { toast } from 'react-toastify';

export function handleError(err) {

    if(!err.response || !err.response.status) {
        toast.error("Something went wrong.", {position: 'top-center'});
        return;
    }

    if(!err.response.data || !err.response.data.error) {
        if(err.response.status === 429)  // used for NGinx rate limit catching
            toast.error("You're doing that too much. Please wait between requests.", {position: 'top-center'});
        else
            toast.error(err.response.status + ", Something went wrong.", {position: 'top-center'});
        return;
    }

    if(Array.isArray(err.response.data.error)) {
        for(const msg of err.response.data.error) 
            toast.error(msg, {position: 'top-center'});
    }
    else
        toast.error(err.response.data.error, {position: 'top-center'});

    if(err.response.data.fields)
        return err.response.data.fields; // Return offending fields if they exist
}