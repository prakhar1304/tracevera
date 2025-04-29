declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, EventDispatcher, Vector3 } from 'three';

    export class OrbitControls extends EventDispatcher {
        constructor(object: Camera, domElement: HTMLElement);

        target: Vector3;
        update(): void;
        dispose(): void;
    }
}
