import {UITags,Address,Page,Button,Div,Text, Title,Image} from "./Converter.js"
import {Anchor} from "./sements.js"

let page1 = new Page("./main.js","./export.html","./export.css")

function eatPizza(){
    console.log("yum")
}
let btn = new Button("click to eat","eat_class","1","head")
btn.build()
btn.configure(["background","red"])
btn.onClick(eatPizza)
let address = new Address("pizza_place",`pizza@hotmail.com ${UITags.br} -s- 0814975197`, "body")
let att = new Anchor("email","gmail@example.com","Anchor1Class")
att.build()
att.insertInto(address)
address.build()
page1.addElement(address)
page1.addElement(btn)
page1.load()