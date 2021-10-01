import {Anchor} from "./sements.js"
import {Animation, UITags,Address,Page,Button,Div,Text, Title,Image, UIElement} from "./Converter.js"

let page = new Page("./main.js","./export.html","./export.css")

let button1 = new Button("click me!", "buttonclass","1","body")
button1.build()

button1.place("50%","50%",UIElement.PositionType.ABSOLUTE,UIElement.Direction.LEFT,UIElement.Direction.TOP)
button1.configure(["transform","scale(3)"])

let anim = new Animation("myanim","whenslide","2s","","","","","","")
page.addElement(button1)
page.load()
