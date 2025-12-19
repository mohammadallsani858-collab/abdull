let scene, camera, renderer, bus, wheels = [];
let money = 1000, speed = 0, targetSpeed = 0, steer = 0, dancing = false, isBraking = false;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 20, 200);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.DirectionalLight(0xffffff, 1.2), new THREE.AmbientLight(0x707070));

    // Infinite Road
    const road = new THREE.Mesh(new THREE.PlaneGeometry(20, 10000), new THREE.MeshPhongMaterial({ color: 0x333333 }));
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    // Advanced Bus
    bus = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.8, 8), new THREE.MeshPhongMaterial({ color: 0x006400 }));
    body.position.y = 1.8; bus.add(body);

    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 32);
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const wP = [[-1.3,0.5,2.5],[1.3,0.5,2.5],[-1.3,0.5,-2.5],[1.3,0.5,-2.5]];
    wP.forEach(p => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.z = Math.PI/2; w.position.set(p[0],p[1],p[2]);
        wheels.push(w); bus.add(w);
    });

    scene.add(bus); camera.position.set(0, 7, 18);
}

function startDance() { speed = 0; dancing = true; document.getElementById('dance-mode').style.display = 'flex'; }
function stopDance() { money += 10; updateUI(); dancing = false; document.getElementById('dance-mode').style.display = 'none'; }
function applyTow() { if(money >= 50) { money -= 50; updateUI(); bus.position.x = 0; } }
function updateUI() { document.getElementById('balance').innerText = money; }

function animate() {
    requestAnimationFrame(animate);
    if (!dancing) {
        if (isBraking) speed *= 0.92; else speed += (targetSpeed - speed) * 0.05;
        bus.position.z -= speed; bus.position.x += steer * speed * 5;
        wheels.forEach(w => w.rotation.x -= speed * 2);
        camera.position.z = bus.position.z + 18; camera.position.x = bus.position.x * 0.7; camera.lookAt(bus.position);
    }
    renderer.render(scene, camera);
}

window.onload = () => {
    init(); animate(); document.getElementById('loader').style.display = 'none';
    const race = document.getElementById('raceBtn'), brk = document.getElementById('brkBtn');
    race.ontouchstart = () => { targetSpeed = 0.8; isBraking = false; };
    race.ontouchend = () => targetSpeed = 0;
    brk.ontouchstart = () => isBraking = true;
    brk.ontouchend = () => isBraking = false;
    document.getElementById('leftBtn').ontouchstart = () => steer = 0.06;
    document.getElementById('leftBtn').ontouchend = () => steer = 0;
    document.getElementById('rightBtn').ontouchstart = () => steer = -0.06;
    document.getElementById('rightBtn').ontouchend = () => steer = 0;
};
