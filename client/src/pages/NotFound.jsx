import DisplayError from '../components/DisplayError';
import Fire from '../assets/fire.gif'

function NotFound() {
    return (
        <DisplayError code='404' text="This page doesn't seem to exist... Stay a while?" image={{component: Fire, width:'200px'}}/>
    );
}

export default NotFound;