

export default class LayersContainer {

    constructor () {
        this.layers_pool = {};
    }

    push(newLayer) {
        this.layers_pool[newLayer.id] = newLayer;
    }

    remove(id) {
        delete this.layers_pool[id];
    }

    getLayer(id) {
        return this.layers_pool[id];
    }

}