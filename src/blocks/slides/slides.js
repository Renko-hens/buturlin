const images = [
    `../img/slides/image_company.png`,
    `../img/slides/image_civitas.png`,
    `../img/slides/image_expert.png`,
    `../img/slides/image_native.png`,
    `../img/slides/image_mis.png`,
    `../img/slides/image_target.png`,
]

//set bg image size


const slidesContent = document.querySelector('.slides__content');
const slidetext = document.querySelector('.slidetext');




class BackgroundCanvas{

    constructor() {
        this.app;
        this.container;
        this.displacementFilter;
    }

    setImageSize(bg){
        if(window.innerWidth > window.innerHeight){ 
            bg.width = this.app.screen.width;
            bg.height = this.app.screen.height * (window.innerWidth / window.innerHeight);
        } else {
            bg.width = this.app.screen.width / (window.innerWidth / window.innerHeight);
            bg.height = this.app.screen.height;
        }
    }

    onMouseMoveHandler(e){
        gsap.killTweensOf(this.container)
        gsap.to(this.container, .5, {
            pixi: {
                x: (this.app.screen.width / 2) + (((window.innerWidth / 2) - e.clientX) / 100),
                y: (this.app.screen.height / 2) + (((window.innerHeight / 2) - e.clientY) / 100)
            }
        })
    }

    init(){
        this.app = new PIXI.Application({
            resizeTo: window,
        });
        
        document.body.appendChild(this.app.view);
        
        this.app.stage.interactive = true;
        
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        
        // create a new background sprite
        const texture = new PIXI.Texture.from(images[0]);
        const background = new PIXI.Sprite(texture);
        
        this.container.x = this.app.screen.width / 2;
        this.container.y = this.app.screen.height / 2;
        
        background.anchor.set(0.5);
        
        this.setImageSize(background);
        
        this.container.addChild(background);
        
        const timeline = gsap.timeline();

        timeline.to(this.container, 5, {
            pixi: {
                scale: 1.04,
            },
            ease: Power1.easeInOut,
        })
        .call(() => window.addEventListener('mousemove', (e) => this.onMouseMoveHandler(e)))
        
        const displacementSprite = PIXI.Sprite.from('../img/sprite2.png');
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        
        displacementSprite.width = this.app.screen.width;
        displacementSprite.height = this.app.screen.height;
        this.displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
        
        
        
        this.app.stage.addChild(displacementSprite);
        
        this.container.filters = [this.displacementFilter];
        
        this.displacementFilter.scale.x = 0;
        this.displacementFilter.scale.y = 0;

        
    }
} 

const bg = new BackgroundCanvas();
bg.init();

let slidesSwiper = new Swiper('.slides__content', {
    speed: 1000,
    mousewheel: true,
    effect: 'fade',
    allowTouchMove: false,
    fadeEffect: {
        crossFade: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            return `
                <div class="${className}"><div class="${className}__dot"></div><p>${this.slides[index].dataset.nav}</p></div>
            `;
        },
    },
    on: {
        init: function(){
            const activeSlideContent = [...this.slides[this.activeIndex].children[0].children[0].children].filter(el => el.tagName === 'DIV');
            const tl = gsap.timeline();
            for(let i = 0; i < activeSlideContent.length; i++){
                tl.to(activeSlideContent[i], 1, {
                    css: {
                        y: 0,
                        opacity: 1,
                    },
                    delay: i === 0 ? 3.5 : -1,
                })
            }
            tl.call(() => this.allowTouchMove = true)
            .call(() => this.mousewheel.enable());

        },
        slideChange: function(){
            changeBorderPosition();
            const image = images[this.realIndex] ? images[this.realIndex] : images[0];
            const prevBg = bg.container.children[0];
            const newTexture = new PIXI.Texture.from(image);
            const newBg = new PIXI.Sprite(newTexture);

            bg.setImageSize(newBg);

            newBg.alpha=0;

            newBg.anchor.set(0.5);

            bg.container.addChild(newBg);

            const tl = gsap.timeline();
            
            tl
            .to(bg.displacementFilter, .5, {
                pixi: { 
                    scaleY: 50,
                },
            })
            .to(bg.displacementFilter, .5, {
                pixi: { 
                    scaleY: 0,
                },
            })
            const activeSlideContent = [...this.slides[this.activeIndex].children[0].children[0].children].filter(el => el.tagName === 'DIV');
            const prevSlideContent = [...this.slides[this.previousIndex].children[0].children[0].children].filter(el => el.tagName === 'DIV');
            for(let i = 0; i < prevSlideContent.length; i++){
                gsap.to(prevSlideContent[i], .5, {
                    css: {
                        y: 40,
                        opacity: 0,
                    },
                    
                    delay: i*.3,
                })
            }
            
            for(let i = 0; i < activeSlideContent.length; i++){
                gsap.to(activeSlideContent[i], .5, {
                    css: {
                        y: 0,
                        opacity: 1,
                    },
                    
                    delay: i*.3,
                })
            }

            gsap.to(prevBg, 1, {
                pixi: { 
                    alpha: 0,
                },
            })
            gsap.to(newBg, 1, {
                pixi:{
                    alpha: 1,
                }
            })
        },
    }
});
slidesSwiper.mousewheel.disable();

const border = document.querySelector('.navigation__circle');

const changeBorderPosition = () => {

    let activeBullet = document.querySelector('.swiper-pagination-bullet-active');
    console.log(activeBullet);
    console.log(activeBullet.offsetLeft);
    gsap.to(border, .5, {
        x: document.body.offsetWidth > 767 ? 
            activeBullet.offsetLeft - (border.offsetWidth / 6) :
            activeBullet.offsetLeft - (border.offsetWidth / 2.35),
    })
}

document.addEventListener('DOMContentLoaded', function(){ // Аналог $(document).ready(function(){
    changeBorderPosition();
});
