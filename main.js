import {Page,Button,Div,Text, Title,Image} from "./Converter.js"

function PrintHello(){
    console.log("hello from the website!")
}

let page = new Page("./main.js", "./export.html", "./export.css")

let div = new Div("div1","div1class","head")
let title = new Text("hello and this is my new website!", "title1class", "head")
title.build()
div.addElement(title)

div.build()

let image = new Image("./sussygarlic.PNG","garlicClass","a sussy garlic","body")
image.build()
page.addElement(image)
page.addElement(div)
page.load()
