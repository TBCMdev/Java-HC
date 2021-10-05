import {Anchor} from "./sements.js"
import {Keyframe, Animation, UITags,Address,Page,Button,Div,Text, Title,Image, UIElement} from "./Converter.js"
import {transform} from './helper.js'
let page = new Page("./main.js","./export.html","./export.css")

let button = new Button("click me!","button1class","1","body")

button.build()
button.onClick(function d(){console.log("thanks!")})
button.configure(["position",UIElement.PositionType.ABSOLUTE],["top","50%"],["left","50%"],["transform","scale(3)"])

page.addElement(button)

let anim = new Animation("button1animscale",[button],"myanim",3,[Animation.params.iteration_count,5],[Animation.params.delay,"2s"])
console.log("SCALE:" + transform.scale(3))
let key = new Keyframe({},{},
    {"0%":
        {"transform":transform.scale(3)},
    "50%": 
        {"transform":transform.scale(6)},
    "100%":
        {"transform":transform.scale(3)}
    })
anim.addKeyFrameParameter(key)
anim.build()

page.addElement(anim)
page.load(true)


