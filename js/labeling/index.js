import AnnotationSurface from './annotation/annotation_surface';
import LayersContainer from './layers/layers_container';
import LayersManagement from './management/layers_management';
import RenderMode from './management/render_mode';
import META_LAYERS from '../ontology';
import VISUAL_LAYERS from '../visuals';


function main () {

    if (document.getElementById("layers_management") == null 
        || document.getElementById("annotation_surface") == null) {
        return;
    }

    const as = new AnnotationSurface(META_LAYERS, VISUAL_LAYERS);
    const lm = new LayersManagement();
    const lc = new LayersContainer();

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