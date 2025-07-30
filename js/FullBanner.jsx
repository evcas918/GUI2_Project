import thinkdocklogo from './assets/ThinkDock_Logo.svg'

function FullBanner () {
    
    return (
       <div class="top-rectangle">
        <div id="logo"><img src={thinkdocklogo} alt="TD logo" width="100" height="100"/></div>
       </div>
    );
}

export default FullBanner