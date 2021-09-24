import {Address,Page,Button,Div,Text, Title,Image} from "./Converter.js"

function PrintHello(){
    console.log("hello from the website!")
}

let page = new Page("./main.js", "./export.html", "./export.css")

let div = new Div("div1","div1class","head")
let title = new Text("hello and this is my new website!", "title1class", "head")
title.build()
div.addElement(title)
let address = new Address("Address1Class","gmail@gmail.com -s- 5731047314","body")
address.build()
div.build()

let image = new Image("./sussygarlic.PNG","garlicClass","a sussy garlic","body")
image.build()
page.addElement(image)
page.addElement(div)
page.addElement(address)
page.load()
