import { readFile, writeFile, writeFileSync } from 'fs'
import {properties} from './css.properties.js'
import {Sement} from './sements.js'
const defHTMLtop = 
`<!DOCTYPE html>
<header>
    <meta charset="UTF-8"/>
    <link rel="stylesheet" type="text/css" href="./export.css"/>
</header>
`//<head> is removed

class UIElement{
    inDiv = false
    placement = false//false is head, true is body
    css = false
    cssUsage = ""
    usage = ""
    moreUsage = false
    additionalUsage = ""
    id = ""
    classVar = ""
    constructor(head){
        switch (head){
            case "head":
                this.placement = false
                break
            case "body":
                this.placement = true
                break
        }
    }
/**
 * adds a parameter to the usage of the element.
 * @param {Sement} sement the sement being added to the attribute  
 * @returns true if the operation is a success, and throws an error otherwise.
 */
    addSement(sement){
        if (!Sement.isPrototypeOf(sement))
            throw new Error(`at 'addSement() in converter.js, cannot add ${sement.constructor.name}' to 
            the UIElement, because ${sement.constructor.name} does not inherit from Sement.`)
        this.usage = this.usage.replace("\\l",`${sement.usage} \\l`)
        return true
    }
    getElement(func){
        try{
            // use this function to assign custom events.
            document.getElementById(this.id)
            return true
        }catch{
            return false
        }
    }
    addProperty(type, property){
        let v = ""
        if (type.includes("=\"\"")){
            try{
                //try thinking it is a function
                v = type.replace("=\"\"",`=\"${property.name}()\"`)
                this.additionalUsage += `\n<script>\n${property.toString()}\n</script>`
            }catch{
                try{
                    v = type.replace("=\"\"",`=\"${property.toString()}\"`)
                }catch{
                    try{
                        v = type.replace("=\"\"",`=\"${property}\"`)
                    }catch(e){
                        console.error(e)
                        return
                    }
                }
            }
        }
        this.usage = this.usage.replace("\\l",`${v} \\l`)
    }
    configure(...x){
        this.css = true
        try{
            for (const xr of x){
                let tup = [xr[0],xr[1]]
                if (properties.includes(tup[0])){
                    if (this.cssProperties.includes(tup[0])){
                        continue
                    }
                        
                    this.cssProperties.push(tup[0])
                    this.addCssValue(tup)
                }else{
                    continue
                }
            }
        }catch(e){
            console.error(e)
        }
    }
    addCssValue(val){
        this.cssUsage = this.cssUsage.slice(0,-1) + this.cssUsage.split(this.cssUsage.slice(0,-1))[0] + this.convertToCssLine(val) + "}"
    }
    convertToCssLine(val){
        return "\t" + val[0] + ": " + val[1] + ";\n"
    }
    onClick(func){
        this.moreUsage = true
        try{
            this.clickEvent = func
            //document.getElementById(this.id).onclick = func only works when server is on
            this.addProperty("onclick=\"\"", func)
            return null
        }catch(e){
            return e
        }
    }
    _predefinedBuild(){
        this.usage = this.usage.replace("class=\"\"","class=\"" + this.classVar + "\"")
        .replace("id=\"\"", `id=\"${this.id}\"`)
        .replace("---name---", this.name)
    }
}

class Page{
    html = defHTMLtop + ``
    head = "<head>\n"
    body = "<body>\n"
    CSSContent = ``
    elements = {"Button": [],"Text": [],"Div": [], "Image": [],"Address": []}
    connected_HMTL_P = ""
    connected_CSS = ""
/**
     * a DIV is a HTML element that holds other elements. it behaves like a class.
     * @param {String} path the text's content/name
     * @param {String} connected_HMTL the class name
     * @param {String} connected_CSS where the element will go in the HTML document. head | body
     */
    constructor(path, connected_HMTL = "",connected_CSS = ""){
        this.html += `<script src=\"${path}\"></script>\n`
        if (connected_HMTL == ""){
            //create file 
            connected_HMTL = ""
            this.connected_HMTL_P = connected_HMTL
        }else{
            this.connected_HMTL_P = connected_HMTL
        }
        if (connected_CSS == ""){
            //create file
        }else{
            this.connected_CSS = connected_CSS
        }
    }

    addElement(element){
        this.elements[element.constructor.name].push(element)
    }
    refresh(){
        this.load()
    }
    load(){
        //#region HTML
        for (var k in this.elements){
            for (const x of this.elements[k]){
                if (!x.placement){
                    this.head += x.usage + "\n"
                    if (x.moreUsage && !this.head.includes(x.additionalUsage)){
                        this.head += x.additionalUsage + "\n"
                    }
                }else{
                    this.body += x.usage + "\n"
                    if (x.moreUsage && !this.body.includes(x.additionalUsage)){
                        this.body += x.additionalUsage + "\n"
                    }
                }
            }
        }
        this.close()
        //#endregion

        //#region CSS
        for (var k in this.elements){
            for(const x of this.elements[k]){
                this.CSSContent += x.cssUsage + "\n"
            }
        }
        //#endregion
        this.finalChecks()
        this.write()
    }

    finalChecks(){
        //check if a div member has been created twice and one of them is outside of the div quadrant
        for(var xr in this.elements){
            for(const x of this.elements[xr]){
                if (x.inDiv){
                    if (this.head.includes(x.usage) || this.body.includes(x.usage)){
                        throw new Error(`at final checks, cannot add '${x.name}'(of type ${x.constructor.name}) to a page as it is in a DIV.
                        please only add the DIV to the page, and not the elements of the DIV.`)
                    }
                }
            }
        }
    }
    close(){
        this.head += "</head>\n"
        this.body += "</body> \n"
    }
    write(){
        writeFileSync(this.connected_HMTL_P,this.html + this.head + this.body,(err) => {
            if(err) throw err
        })//writes the HTML file.
        writeFileSync(this.connected_CSS,this.CSSContent,(err) =>{
            if(err)throw err
        })//writes the CSS file.
    }
}
class Button extends UIElement{
    usage = "<button id=\"\" class=\"\" \\l>---name---</button>"
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
    clickEvent = null
    hoverEvent = null

    /**
     * a Button is a HTML element used mostly for click and hover events.
     * @param {String} name the text's content/name
     * @param {String} c the class name
     * @param {String} id the id of the Button
     * @param {String} _placement where the element will go in the HTML document. head | body
     */
    constructor(name,c,id,_placement){
        super(_placement)
        this.classVar = c
        this.id = id
        this.name = name
        this.cssUsage = `.${this.classVar}{\n}`
    }

    
    
    /**
     * build the element. this is called when the element is completely finished and ready to be put 
     * on a HTML page. However, when changing the CSS or Custom values of an element, they must be
     * configured after.
     */
    build(){
        this._predefinedBuild()// for the static proerties to be assigned
    }
}
class Text extends UIElement{
    usage = "<p id=\"\" class=\"\">---name---</p>"
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
/**
     * text is a HTML element that displays text to the page.
     * @param {String} name the text's content/name
     * @param {String} c the class name
     * @param {String} _placement where the element will go in the HTML document. head | body
     */
    constructor(name,c,_placement){
        super(_placement)
        this.classVar = c
        this.name = name
        this.cssUsage = `.${this.classVar}{\n}`
    }
   /**
     * build the element. this is called when the element is completely finished and ready to be put 
     * on a HTML page. However, when changing the CSS or Custom values of an element, they must be
     * configured after.
     */
    build(){
        this._predefinedBuild()
    }
}
class Title extends UIElement{
    usage = "<title id=\"\" class=\"\">---name---</title>"
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
/**
     * the title is the title of the HTML page.
     * @param {String} name the Title content/name
     * @param {String} c the class name
     * @param {String} _placement where the element will go in the HTML document. head | body
     */
    constructor(name,c,_placement){
        super(_placement)
        this.classVar = c
        this.name = name
        this.cssUsage = `.${this.classVar}{\n}`
    }
    /**
     * build the element. this is called when the element is completely finished and ready to be put 
     * on a HTML page. However, when changing the CSS or Custom values of an element, they must be
     * configured after.
     */
    build(){
        this._predefinedBuild()
    }
}
class Link extends UIElement{
    usage = "<link id=\"\" class=\"\">---name---</link>"
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
    /**
     * a DIV is a HTML element that holds other elements. it behaves like a class.
     * @param {String} link the links content
     * @param {String} c the class name
     * @param {String} _placement where the element will go in the HTML document. head | body
     */
    constructor(link,c,_placement){
        super(_placement)
        this.classVar = c
        this.name = link
        this.cssUsage = `.${this.classVar}{\n}`
    }
   /**
     * build the element. this is called when the element is completely finished and ready to be put 
     * on a HTML page. However, when changing the CSS or Custom values of an element, they must be
     * configured after.
     */
    build(){
        this._predefinedBuild()
    }
}


   /**
 * Div is a HTML element used for storing nuermous elements into a class.
 */
class Div extends UIElement{


    usage = "<div id=\"\" class=\"\">---cont---\n</div>"
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
    elements = []
    /**
     * a DIV is a HTML element that holds other elements. it behaves like a class.
     * @param {String} name the name of the DIV
     * @param {String} c the div class name
     * @param {String} _placement where the element will go in the HTML document. head | body
     * @param {String || Array]} elements the DIV's current elements. can be ignored. only accepts objects that extend from UIElement.
     */
    constructor(name,c,_placement,elements = []){
        super(_placement)
        this.elements = elements
        this.classVar = c
        this.name = name
        this.cssUsage = `.${this.classVar}{\n}`
    }
    /**
     * 
     * @param {UIElement} el 
     * @returns true if the element is added, and false if otherwise.
     */
    addElement(el){
        if(!this.elements.includes(el)){
            this.elements.push(el)
            return true
        }
        return false
    }
    /**
     * 
     * @param {UIElement} el 
     */
    removeElement(el){
        this.elements.splice(this.elements.indexOf(el))
    }
    /**
     * build the element. this is called when the element is completely finished and ready to be put 
     * on a HTML page. However, when changing the CSS or Custom values of an element, they must be
     * configured after.
     */
    build(){
        this._predefinedBuild()
        this.elements.forEach(x => {
            x.inDiv = true
            this.usage = this.usage.replace("---cont---",`\n${x.usage} ---cont---`)
        })
        this.usage = this.usage.replace("---cont---","")
    }
}
class Image extends UIElement{
    usage = "<image id=\"\" class=\"\" alt=\"\" src=\"\"></image>"
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
    alt = ""
    /**
     * an Image is a HTML element used to display custom images to the page.
     * @param {String} src the file path to the image
     * @param {String} c the class
     * @param {String} alt the alternative text to the image. this is used as a kind of description.
     * @param {String} placement where the element will go in the HTML file. body | head
     */
    constructor(src,c,alt = "",_placement){
        super(_placement)
        this.classVar = c
        this.name = src
        this.alt = alt
        this.cssUsage = `.${this.classVar}{\n}`
    }
    /**
     * build the element. this is called when the element is completely finished and ready to be put 
     * on a HTML page. However, when changing the CSS or Custom values of an element, they must be
     * configured after.
     */
    build(){
        this._predefinedBuild()
        this.usage = this.usage.replace(`src=\"\"`,`src=\"${this.name}\"`)
        .replace("alt=\"\"", `alt=\"${this.alt}\"`)
    }
}
class Address extends UIElement{
    usage = "<address id=\"\" class=\"\">---cont---</address>"
    cssUsage = `.${this.classVar}{\n}`
    cssProperties = []
    name = ""
    content = [] || ""
    constructor(c,content = [] || "",_placement){
        super(_placement)
        this.classVar = c
        this.name = ""
        this.content = content
        this.cssUsage = `.${this.classVar}{\n}`
    }
    /**
     * build the element. this is called when the element is completely finished and ready to be put 
     * on a HTML page. However, when changing the CSS or Custom values of an element, they must be
     * configured after.
     */
    build(){
        this._predefinedBuild()
        if (typeof(content) == "object"){
            // treat it like an array
            for (const x of this.content){
                this.usage = this.usage.replace("---cont---",`${x}\n ---cont---`)
            }
        }else{
            //treat it like a string 
            if(this.content.includes("-s-") && !this.content.includes("\"-s-")){
                // it wants to  be split
                for (const x of this.content.split("-s-")){
                    if (!this.inQuotes(x)){
                        this.usage = this.usage.replace("---cont---",`${x}\n ---cont---`)
                    }
                }
            }
        }
        this.usage = this.usage.replace("---cont---","")
    }
    inQuotes(){
        let temp = ["\'","\""]
        if (this.content.includes("-s-")){
            if(this.content.includes("\"")){
                if (this.content.indexOf("\"") < this.content.indexOf("-s-") || 
                this.content.indexOf("\'") < this.content.indexOf("-s-") && 
                temp.some(el =>this.content.split("\"")[1]) || temp.some(el =>this.content.split("\'")[1])){
                    return true
                    //checks to see if a split indicator(-s-) is in between "" or '', and if so then we should 
                    //return true
                }
            }
        }
        return false
    }
}
class UITags{
    static br = "<br>"
}
export{UIElement,UITags,Address,Page,Text,Button,Div,Link,Image,Title}