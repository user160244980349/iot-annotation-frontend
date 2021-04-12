import AnnotationSurface from './annotation/annotation_surface';
import LayersContainer from './layers_container';
import LayersManagement from './layers_management';
import metaLayers from '../config';


function main () {

    const as = new AnnotationSurface(metaLayers);
    const lm = new LayersManagement();
    const lc = new LayersContainer();

    as.mouseEnter = (e) => {lm.render(e);}
    as.pushToContainer = (e) => {lc.push(e);}
    as.removeFromContainer = (id) => {lc.remove(id);}
    as.offerNewLayer = (l) => {console.log("offer new layer");}
    as.getLayer = (id) => {return lc.getLayer(id);}
    lm.getLayer = (id) => {return lc.getLayer(id);}

    document.onselectionchange = () => {
        as.readSelection();
    };

    document.onkeypress = (event) => {

        if (event.key == "q") {
            as.addLayer("s1");
        }
        if (event.key == "w") {
            as.addLayer("s2");
        }
        if (event.key == "e") {
            as.addLayer("s3");
        }
        if (event.key == "r") {
            as.addLayer("s4");
        }
        if (event.key == "a") {
            as.addLayer("s5");
        }
        if (event.key == "s") {
            as.addLayer("s6");
        }
        if (event.key == "d") {
            as.addLayer("s7");
        }
        if (event.key == "f") {
            as.addLayer("s8");
        }
        
    };
}

document.addEventListener('DOMContentLoaded', main);