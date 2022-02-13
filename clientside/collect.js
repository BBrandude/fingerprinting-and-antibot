function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//checks audio codecs support 
function getAudioInfo() {       
    var a = document.createElement('audio')
    return {
        ogg: a.canPlayType('audio/ogg; codecs="vorbis"'),
        mp3: a.canPlayType("audio/mpeg"),
        wav: a.canPlayType('audio/wav; codecs="1"'),
        m4a: a.canPlayType("audio/x-m4a;"),
        aac: a.canPlayType("audio/aac;"),
        avi: a.canPlayType('video/x-msvideo'),
        bin: a.canPlayType('application/octet-stream'),
    }
}

//checks video codecs support 
function getVideoInfo() {
    var v = document.createElement('video')
    return {
        ogg: v.canPlayType('video/ogg; codecs="theora"'),
        h264: v.canPlayType('video/mp4; codecs="avc1.42E01E"'),
        webm: v.canPlayType('video/webm; codecs="vp8, vorbis"'),
        mp4: v.canPlayType('video/mp4'),
        app: v.canPlayType('application/ogg')
    }
}

//checks if the user agent is consistent with a mobile device using regex, this is used in the touchPointTests function
const deviceType = () => {
    const agent = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(agent)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(agent)) {
        return "mobile";
    }
    return false;
};

//checks if the user is on a mobile device or a device that has a touch screen. 
//It is used both for both general info and to check if the mouse movement script is viable to run later on.
function touchPointTests() {
    var t = false
    try {
        document.createEvent("TouchEvent"), t = true
    } catch (e) {
        t = false
    }
    let t2 = "ontouchstart" in window
    let t3 = navigator.maxTouchPoints
    let t4 = navigator.msMaxTouchPoints
    let t5 = navigator.userAgentData.mobile
    let t6 = deviceType()
    
    let touchTests = {
        t1: t,
        t2: t2,
        t3: t3,
        t4: t4,
        t5: t5,
        t6: t6,
    }

    let touchPointPresent

    if (touchTests.t1 == true) {
        touchPointPresent = true
    } else if (touchTests.t2 == true) {
        touchPointPresent = true
    } else if (touchTests.t3 > 0) {
        touchPointPresent = true
    } else if (touchTests.t4 > 0) {
        touchPointPresent = true
    } else if (touchTests.t5 == true) {
        touchPointPresent = true
    } else if ((touchTests.t6 == "tablet") || (touchTests.t6 == "mobile")) {
        touchPointPresent = true
    } else {
        touchPointPresent = false
    }

    return {
        hasTouchPoints: touchPointPresent,
        testDetails: touchTests,
    }


}


//tests to see if properties consistent with a webdriver are present. This function is nowhere near complete
function automationTests() {
    let v = "domAutomation" in window
    let d = "domAutomationController" in window
    let autoTests = {
        t1: v,
        t2: d
    }

    return autoTests
}

//retrieves the clients gpu info
function getVideoCardInfo() {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    const glDebugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (glDebugInfo) {
        return gl.getParameter(glDebugInfo.UNMASKED_RENDERER_WEBGL)
    } else {
        return "not present"
    }
}








export default async function antibot() {

    let touchScreenTests = touchPointTests()

    let mouseMovements = []

    /*
    Records clients mouse movements if they are not on a device with a touchscreen.
    This is in a x coordinate, y coordinate, and time by millisecond format.
    This would be ideal to protect specific POST endpoints since the user would likely have to move their mouse to click a button 
    or submit some form of data. 
    I need to add a function that detects the touch events if the user is on a device with a touchscreen
    */
    if (touchScreenTests.hasTouchPoints == false) {
        window.addEventListener('mousemove', function (e) {
            let time = Date.now()
            let coordinate = e.screenX + ',' + e.screenY + ',' + time
            mouseMovements.push(coordinate)
        })
        while (mouseMovements.length < 10) {
            await sleep(1)
        }
    }


    const userData = {
        
        userAgentIndentifier: navigator.userAgent,
        userAppVersion: navigator.appVersion, //similar to userAgent
        isWebDriver: navigator.webdriver, //boolean
        isOnline: navigator.isOnline, //determines online connection 
        hardwareConcurrency: navigator.hardwareConcurrency, //value is different for every browser, match with the browser from another value
        isCookieEnabled: navigator.cookieEnabled, //should be true even in incognito 
        dontTrack: navigator.doNotTrack,
        userPlatform: navigator.platform, //related to OS
        userOperatingSystem: navigator.userAgentData.platform, //related to OS
        userLanguage1: navigator.language,
        userLanguage2: navigator.languages,
        userTouchpoint: navigator.maxTouchPoints,
        userMemory: navigator.deviceMemory,
        
        InnerHeight: window.innerHeight,
        OuterHeight: window.outerHeight,
        OuterWidth: window.outerWidth,
        InnerWidth: window.innerWidth,
        ScreenX: window.screenX,
        ScreenY: window.screenY,
        PageXOffset: window.pageXOffset,
        PageYOffset: window.pageYOffset,
        docWidth: document.body.clientWidth,
        docHeight: document.body.clientHeight,
        windWidth: screen.width,
        windHeight: screen.height,
        AvailWidth: screen.availWidth,
        AvailHeight: screen.availHeight,
        ColorDepth: screen.colorDepth,
        PixelDepth: screen.pixelDepth,
        DevicePixelRatio: window.devicePixelRatio,

        isTouchScreenInfo: touchScreenTests,

        MouseMovements: mouseMovements,

        audioInfo: getAudioInfo(),
        videoInfo: getVideoInfo(),

        gpuInfo: getVideoCardInfo(),

        automationTests: automationTests(),

    }

    return userData
}
