import  Carousel from './carrusel.jsx'
import  BlogSection from './ui/blog.jsx'
import HeaderUsReg from './HeaderUsReg.jsx';
import 'tailwindcss/tailwind.css';
function Home() {
    
    return (
        <main>
        <HeaderUsReg/>

<Carousel/>

<BlogSection/>
        </main>

           
 
    )
}
export default Home