import style from './sass/style.sass'
import {TimelineMax, TweenMax} from 'gsap'
import cover from 'canvas-image-cover'
import node from './js/node.json'
//import ScrollMagic from 'scrollmagic'
//import 'animation.gsap'
//import 'debug.addIndicators'

let iteration = 0
// Canvas init
let canvas = document.getElementById('bg'),
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let curentImage = new Image
let prevImage = new Image
// if (node.item.length>1) {
//     node.prevActive = node.item.length-1
//     node.nextActive = node.active+1    
// }

document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
    element.style.transform = `translateY(${iteration}em)`
    iteration += 2
})

let tl = new TimelineMax()
enableWheel()

function wheel(e) {
    node.prevActive = node.active
    if(e.deltaY<0) {
        console.log('wheel scrolled up')
        if (node.active === 0) {
            node.active = node.item.length-1    
        } else {
            node.active -= 1
        } 
        animateImage()
        //scrollItemDown().then(res=>enableWheel())
    } else {
        console.log('wheel scrolled down')
        if (node.active === node.item.length-1) {
            node.active = 0    
        } else {
            node.active += 1
        } 
        animateImage()
        //scrollItemUp().then(res=>enableWheel())
    }
    console.log(node.active)
}

// function changePage() {
//     nextImage.src = node.item[node.prevActive].img
// }

// document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
//     let style = window.getComputedStyle(element)
//     let matrix = new WebKitCSSMatrix(style.webkitTransform)
//     tl.to(element, 0.5, {opacity: 1, y: matrix.m42+24})
//     let menuScene = new ScrollMagic.Scene({
//         offset: 0,
//         triggerElement: element,
//         triggerHook: 0 
//     })  
//         .addIndicators({name:'MenuItem'})
//         .addTo(controller)
//         .setTween(tl)
// })

// console.log(JSON.stringify(node))

// function changePosUp(pos, element, resolve) {
//     let matrix ={
//         '0': is0,
//         '24': is24
//         //'192': is192
//     }
//     let tl = new TimelineMax()
    
//     // function is192() {
//     //     tl.to(element, 0.5, {y: 120, opacity: 1, ease: Power3.easeOut})
//     // }

//     function is0() {
//         tl.to(element, 0.5, {y: -48, opacity: 0, ease: Power3.easeOut})
//             .set(element, {opacity: 0, y: 144, onComplete: ()=>resolve()})
//     }
//     function is24() {
//         tl.to(element, 0.5, {opacity: 1, y: pos-24})
//     }

//     return (matrix[pos] || matrix[24])()    
// }

// function changePosDown(pos, element, resolve) {
//     let matrix ={
//         '144': isInvis,
//         //'-48': isUvisible,
//         '24': isMiddle
//     }
//     let tl = new TimelineMax()
//     function isInvis() {
//         tl.to(element, 0.5, {opacity: 0, y: 192})
//             .set(element, {opacity: 0, y: 0, onComplete: ()=>resolve()})
//     }
//     // function isUvisible() {
//     //     tl.to(element, 0.5, {opacity: 1, y: 24, ease: Power3.easeOut})
//     // }
//     function isMiddle() {
//         tl.to(element, 0.5, {opacity: 1, y: pos+24})
//     }

//     return (matrix[pos] || matrix[24])()    
// }

// function scrollItemUp(){
//     return new Promise((resolve, reject) => {
//         document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
//             let style = window.getComputedStyle(element)
//             let matrix = new WebKitCSSMatrix(style.webkitTransform)
//             changePosUp(matrix.m42, element, resolve)
//         })
//     })
// }

// function scrollItemDown() {
//     return new Promise((resolve, reject) => {
//         document.querySelectorAll('.menuItem').forEach( (element, index, array) => {
//             let style = window.getComputedStyle(element)
//             let matrix = new WebKitCSSMatrix(style.webkitTransform)
//             changePosDown(matrix.m42, element, resolve)
//         })
//     })
// }

function disableWheel() {
    document.removeEventListener('mousewheel', wheel);
    document.removeEventListener('DOMMouseScroll', wheel);
}

function enableWheel() {
    document.addEventListener('mousewheel', wheel);
    document.addEventListener('DOMMouseScroll', wheel);
}

window.addEventListener('resize', resize)
function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    animateImage()
}

function animateImage() {
    curentImage.src = node.item[node.active].img
    curentImage.globalAlpha = 0
    curentImage.DX = canvas.height
    prevImage.src = node.item[node.prevActive].img
    prevImage.globalAlpha = 1
    TweenMax.ticker.addEventListener('tick', ()=>{
        render(curentImage.DX)
    })
    let tl = new TimelineMax()
    tl.to(curentImage, 1, { globalAlpha:1, DX: 0})
        .to(prevImage, 1, { globalAlpha:0}, "-=1")
}

function render(curentDX) {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.globalAlpha = prevImage.globalAlpha
    cover(prevImage, 0, 0, canvas.width, canvas.height).render(ctx)
    ctx.globalAlpha = curentImage.globalAlpha
    cover(curentImage, 0, curentDX, canvas.width, canvas.height).render(ctx)
    
}

animateImage()
