

let count = 0;

export default class Layer {

    constructor (metaLayer, selection) {
        this.id = count++;
        this.selection = selection;
        this.metaLayer = metaLayer;
    }

    get color () {return this.metaLayer.color;}

    get name () {return this.metaLayer.name;}

    get label () {return this.metaLayer.label;}

    get superlayer () {return this.metaLayer.superlayer;}

    get element () {
        this.metaLayer.el.setAttribute("data-layers", this.id);
        return this.metaLayer.el;
    }

}