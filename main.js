import {Anchor} from "./sements.js"
import {UITags,Address,Page,Button,Div,Text, Title,Image} from "./Converter.js"


let page = new Page("./main.js","./export.html","./export.css")

let button = new Button("click me!","clickmebutton","1","body")
button.build()

button.configure(["position","relative"],["left","50%"],["background","red"])

let address = new Address("address1","","body")

let anc1 = new Anchor("gmail@gmail.com",Anchor.HREFType.EMAIL,"gmail:","anc1Class")
anc1.build()

anc1.insertInto(address)
address.build()

address.configure(["position","relative"],["left","50%"])
let img = new Image("./pizza.jpg","pizzaClass","pizza!","body")
img.build()

img.configure(["position","relative"],["left","50%"])

page.addElement(img)
page.addElement(address)
page.addElement(button)
page.load(true)