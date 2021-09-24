import { UIElement } from "./Converter.js";

class Sement{
    constructor(temp){
        return
    }
}

class Anchor extends {Sement,UIElement} {
    usage = "<a id=\"\" class=\"\" href= \"\">---name---</a>"
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
    href = ""
/**
     * an anchor is a HTML element that is used for adding hyperlinks that lead to other programs such 
     * as emails.
     * @param {String} name the anchors text
     * @param {String} href the link to the attribute
     * @param {String} c the class name
     * @param {String} _placement where the element will go in the HTML document. head | body
     */
    constructor(text, href,c){
        super("null")
        this.classVar = c
        this.name = text
        this.href = href
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
        element.addSement(this)
    }
}
export {Sement, Anchor}