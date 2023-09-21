import cat1 from '../assets/cat1.png';
import cat2 from '../assets/cat2.png';
import cat3 from '../assets/cat3.png';
import cat4 from '../assets/cat4.png';
import cat5 from '../assets/cat5.png';

const catArray = [cat1, cat2, cat3, cat4, cat5];

export default function selectRandomCat() {
    const index = Math.floor(Math.random() * catArray.length);
    return catArray[index];    
}