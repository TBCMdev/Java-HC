import {UIElement} from "./Converter.js"

<<<<<<< HEAD

class Sement{
    constructor(temp){
        return
    }
}
class Anchor extends {Sement,UIElement} {
    usage = "<a id=\"\" class=\"\" href= \"\">---name---</a>"
=======
class Sement extends UIElement{
    constructor(head){
        super(head)
    }
}

class Anchor extends Sement {
    static HREFType = {
        EMAIL: "mailto:",
        TEL: "tel:",
        NONE: ""
    }
    usage = "<a id=\"\" class=\"\" href=\"\">---name---</a>"
>>>>>>> 755565ad42f2a0280de9ea953d0321a042d1e4b0
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
    href = ""
    /**
     * an anchor is a HTML element that is used for adding hyperlinks that lead to other programs such 
     * as emails.
     * @param {String} name the anchors text
     * @param {String} href the link to the attribute
     * @param {HREFType} hrefType the type of the href. There is an in built ENUM in the Anchor class for this.
     * @param {String} c the class name
     * @param {String} _placement where the element will go in the HTML document. head | body
     */
    constructor(text,hrefType, href,c){
        super("null")
        this.classVar = c
        this.name = text
        this.href = hrefType + href
        this.cssUsage = `.${this.classVar}{\n}`
    }
   /**
     * build the element. this is called when the element is completely finished and ready to be put 
     * on a HTML page. However, when changing the CSS or Custom values of an element, they must be
     * configured after.
     */
    build(){
        this._predefinedBuild()
        this.usage = this.usage.replace("href=\"\"",`href=\"${this.href}\"`)
    }
    /**
     * 
     * @param {UIElement} element 
     */
    insertInto(element){
        if(!element.addSement(this)){
            return false
        }
        this.inElement = true
        return true
    }
}
export {Sement, Anchor}