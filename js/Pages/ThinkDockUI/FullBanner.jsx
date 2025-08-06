import thinkdocklogo from './icon-logo.svg'
import NavBar from './NavBar';

function FullBanner () {
    return (
        <>
       <div class="top-rectangle">
        <header id='app-logo'>
            <h1>ThinkDock</h1>
        </header>
        <div id="logo"><img src={thinkdocklogo} alt="TD logo" style={{width: 75, height: 75, borderRadius: 75/ 2}}/></div>
        <NavBar/>
       </div>
       </>
    );
}

export default FullBanner