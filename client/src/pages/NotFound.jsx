import DisplayError from '../components/DisplayError';

function NotFound() {
    return (
        <DisplayError code='404' text="This page doesn't seem to exist... Stay a while?"/>
    );
}

export default NotFound;