/**
 * @file texture_generator.js
 * @description Generador procedural de texturas de paredes.
 */

import * as THREE from 'three';

const createPastelYellowWallTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#fef9c3');
    grad.addColorStop(0.5, '#fef08a');
    grad.addColorStop(1, '#faecc5');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 14;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.7));
    }
    ctx.putImageData(imgData, 0, 0);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < 45; i++) {
        const y = Math.random() * 512;
        const h = Math.random() * 6 + 2;
        ctx.fillRect(0, y, 512, h);
    }
    ctx.fillStyle = 'rgba(217, 119, 6, 0.035)';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 512;
        const w = Math.random() * 8 + 2;
        ctx.fillRect(x, 0, w, 512);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 2.5);
    return tex;
};

const createThematicRoomWallTexture = (hexColor = '#ece8e1') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const col = new THREE.Color(hexColor);
    const lighterCol = col.clone().offsetHSL(0, -0.04, 0.09);
    const darkerCol = col.clone().offsetHSL(0, 0.03, -0.07);

    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#' + lighterCol.getHexString());
    grad.addColorStop(0.5, '#' + col.getHexString());
    grad.addColorStop(1, '#' + darkerCol.getHexString());
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 16;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.11)';
    for (let i = 0; i < 40; i++) {
        const y = Math.random() * 512;
        const h = Math.random() * 6 + 2;
        ctx.fillRect(0, y, 512, h);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
    for (let i = 0; i < 35; i++) {
        const y = Math.random() * 512;
        const h = Math.random() * 4 + 1;
        ctx.fillRect(0, y, 512, h);
    }
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * 512;
        const w = Math.random() * 6 + 2;
        ctx.fillRect(x, 0, w, 512);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 2.5);
    return tex;
};

export { createPastelYellowWallTexture, createThematicRoomWallTexture };
