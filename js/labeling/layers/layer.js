

let count = 0;

export default class Layer {

    constructor (metaLayer, selection) {
        this.id = count++;
        this.selection = selection;
        this.metaLayer = metaLayer;
    }

    get color () {return this.metaLayer.color;}

    get label () {return this.metaLayer.label;}

    get class () {return this.metaLayer.class;}

    get subclassOf () {return this.metaLayer.subclassOf;}

    get attributeOf () {return this.metaLayer.attributeOf;}

    get element () {
        this.metaLayer.el.setAttribute("data-layers", this.id);
        return this.metaLayer.el;
    }

}