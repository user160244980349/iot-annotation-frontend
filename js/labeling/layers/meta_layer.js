

export default class MetaLayer {

    constructor (prototype, visuals) {
        this.class = prototype["class"];
        this.subclassOf = prototype["subclassOf"];
        this.attributeOf = prototype["attributeOf"];
        this.label = visuals["label"];
        this.css_classes = visuals["css_classes"];
        
        this.el = document.createElement("span");
        this.el.classList.add(...this.css_classes);
        
        this.el.hidden = true;
        document.body.appendChild(this.el);
        this.color = window.getComputedStyle(this.el).getPropertyValue("background-color");
        document.body.removeChild(this.el);
        this.el.hidden = false;
    }

}