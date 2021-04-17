import AnnotationSurface from './annotation/annotation_surface';
import LayersContainer from './layers_container';
import LayersManagement from './layers_management';
import META_LAYERS from '../config';
import RenderMode from './render_mode';


function main () {

    let as = new AnnotationSurface(META_LAYERS);
    let lm = new LayersManagement();
    let lc = new LayersContainer();

    as.getLayer = (id) => {return lc.getLayer(id);}
    as.pushToContainer = (e) => {lc.push(e);}
    as.removeFromContainer = (id) => {lc.remove(id);}
    
    as.mouseClick = (ls, state) => {lm.render(RenderMode.ELEMENT, state, ls);}
    as.mouseEnter = (ls, state) => {lm.render(RenderMode.ELEMENT, state, ls);}
    as.suggestNewLayer = (ls, state) => {lm.render(RenderMode.SUGGESTIONS, state, ls);}

    lm.getLayer = (id) => {return lc.getLayer(id);}
    lm.applyLayer = (l) => {as.applyLayer(l);}
    lm.removeLayer = (l) => {as.removeLayer(l);}

}

document.addEventListener('DOMContentLoaded', main);