

export default class MetaLayer {

    constructor (prototype) {
        this.classes = prototype["classes"];
        this.label = prototype["label"];
        this.name = prototype["name"];
        this.superlayer = prototype["superlayer"];
        
        this.el = document.createElement("span");
        this.el.classList.add(...this.classes);
        
        this.el.hidden = true;
        document.body.appendChild(this.el);
        this.color = window.getComputedStyle(this.el).getPropertyValue("background-color");
        document.body.removeChild(this.el);
        this.el.hidden = false;
    }

}