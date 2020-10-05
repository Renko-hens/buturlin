let startScreen = document.querySelector('.screen');
let icon = document.querySelector('.logo__icon');
let invisibleItems = document.querySelectorAll('.invisible');
let animatedIcon = document.querySelector('.animationgroup'); 

class StartScreenAnimation{

    constructor(logo) {
        this.logo = logo;
    }

    parseGroup(){
        let transform= getComputedStyle(this.logo).getPropertyValue('transform');
        this.logo.setAttribute('transform', transform);
        
        const filteredLogo = [...this.logo.childNodes].filter(el => el.tagName === `path`);
        const circles = filteredLogo.filter(el => el.className.baseVal.indexOf('circle') > -1);
        const lines = filteredLogo.filter(el => el.className.baseVal.indexOf('line') > -1);
        const letters = filteredLogo.filter(el => el.className.baseVal.indexOf('letter') > -1);

        return {
            circles,
            lines,
            letters
        }
    }

    init(){
        let tl = gsap.timeline();
        const parsedLogo = this.parseGroup();
        tl
            .to(parsedLogo.circles, .4, {
                css: {
                    strokeDashoffset: 0,
                },
                delay: .4
            })
            .to(parsedLogo.lines, .4, {
                css: {
                    strokeDashoffset: 0,
                },
                delay: -.1,
            })
            .to(parsedLogo.letters[0], .4, {
                css: {
                    strokeDashoffset: getComputedStyle(parsedLogo.letters[0]).strokeDashoffset.replace('px', '') * 2,
                },
                delay: -.25,
            })
            .to(parsedLogo.letters[1], .4, {
                css: {
                    strokeDashoffset: 0,
                },
                delay: -.35,
            })
            .to(startScreen, 1, {
                css:{
                    opacity: 0,
                },
                delay: .5,
            })
            .to(startScreen, 0, {
                css:{
                    display: `none`,
                }
            })
            .to(icon, .3, {
                opacity: 0,
                delay: -1,
            })
            .to(icon, 0, {
                top: `auto`,
                left: `auto`,
                scale: 1,
                transform: `translate(0,0)`,
                delay: 0,
            })
            .to(icon, 0, {
                css: {
                    position: `static`,
                }
            })
            .to(icon, .5, {
                delay: .2,
                css: {
                    opacity: 1,
                    width: `auto`,
                    height: `auto`,
                }
            })
            .to(invisibleItems, 1, {
                css:{
                    opacity:1,
                },
            })
    }
}

const startScreenAnimation = new StartScreenAnimation(animatedIcon);

startScreenAnimation.init();

