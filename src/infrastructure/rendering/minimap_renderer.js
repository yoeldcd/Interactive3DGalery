/**
 * @file minimap_renderer.js
 * @description Renderizador en Canvas 2D del minimapa interactivo centrado en el jugador en tiempo real.
 */

import * as THREE from 'three';

/**
 * Renderizador MinimapRenderer.
 */
class MinimapRenderer {

    /**
     * @param {HTMLCanvasElement|string} [canvasOrId='minimap-canvas'] - Elemento Canvas o su ID.
     */
    constructor(canvasOrId = 'minimap-canvas') {
        this.canvas = typeof canvasOrId === 'string' ? document.getElementById(canvasOrId) : canvasOrId;
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.layout = {
            startZ: 0,
            endZ: 0,
            hallWidth: 6.4,
            rooms: []
        };
        this.roomList = [];
    }

    /**
     * Asigna o actualiza los datos de diseño de la galería.
     * @param {object} layoutData - Estructura de pasillo y salones.
     * @param {Array} [roomList=[]] - Lista de salas 3D activas.
     * @returns {void}
     */
    setLayout(layoutData, roomList = []) {
        this.layout = layoutData || { startZ: 0, endZ: 0, hallWidth: 6.4, rooms: [] };
        this.roomList = roomList || [];
    }

    /**
     * Renderiza el minimapa centrado en la posición y orientación del jugador.
     * @param {THREE.Camera} camera - Cámara de la escena.
     * @returns {void}
     */
    render(camera) {
        if (!this.canvas) {
            this.canvas = document.getElementById('minimap-canvas');
            if (this.canvas) this.ctx = this.canvas.getContext('2d');
        }
        if (!this.ctx || !this.canvas || !camera) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);

        const layout = this.layout;
        if (!layout) return;

        const camPos = camera.position;
        const playerX = camPos.x;
        const playerZ = camPos.z;

        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 3.6;

        const toScreenX = (wx) => centerX + (wx - playerX) * scale;
        const toScreenY = (wz) => centerY + (wz - playerZ) * scale;

        const hw = (layout.hallWidth || 6.4) / 2;
        const p1x = toScreenX(-hw);
        const p1y = toScreenY(layout.startZ || 6);
        const p2x = toScreenX(hw);
        const p2y = toScreenY(layout.endZ || -50);

        const hallTopY = Math.min(p1y, p2y);
        const hallHeightPx = Math.abs(p2y - p1y);

        // Fondo y borde del pasillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(p1x, hallTopY, p2x - p1x, hallHeightPx);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(p1x, hallTopY, p2x - p1x, hallHeightPx);

        // Salones poligonales y conectores
        if (layout.rooms) {
            layout.rooms.forEach((room) => {
                const rx = toScreenX(room.x);
                const ry = toScreenY(room.z);

                const roomInfo = this.roomList.find(r => r.id === room.id);
                const isRendered = roomInfo ? (roomInfo.object3D && roomInfo.object3D.visible !== false) : true;

                const hallEdgeX = toScreenX((room.sideSign || 1) * hw);
                const connY = toScreenY(room.z);

                // Conector pasillo-sala
                ctx.fillStyle = isRendered ? 'rgba(250, 204, 21, 0.35)' : 'rgba(255, 255, 255, 0.08)';
                ctx.strokeStyle = isRendered ? 'rgba(250, 204, 21, 0.8)' : 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.rect(
                    Math.min(hallEdgeX, rx),
                    connY - 3,
                    Math.abs(rx - hallEdgeX),
                    6
                );
                ctx.fill();
                ctx.stroke();

                // Polígono del salón
                if (room.vertices && room.vertices.length > 0) {
                    ctx.fillStyle = isRendered ? 'rgba(250, 204, 21, 0.18)' : 'rgba(15, 23, 42, 0.6)';
                    ctx.strokeStyle = isRendered ? '#facc15' : (room.color || 'rgba(148, 163, 184, 0.4)');
                    ctx.lineWidth = isRendered ? 2.0 : 1.2;
                    ctx.beginPath();
                    room.vertices.forEach((v, idx) => {
                        const vx = toScreenX(v.x);
                        const vy = toScreenY(v.z);
                        if (idx === 0) ctx.moveTo(vx, vy);
                        else ctx.lineTo(vx, vy);
                    });
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }

                // Centro del salón
                ctx.fillStyle = isRendered ? '#facc15' : 'rgba(148, 163, 184, 0.6)';
                ctx.beginPath();
                ctx.arc(rx, ry, isRendered ? 3.0 : 2.0, 0, Math.PI * 2);
                ctx.fill();

                // Etiqueta de texto
                const rRad = (room.radius || 14.5) * scale;
                const rName = room.name || 'Salón';
                const shortName = rName.length > 12 ? rName.substring(0, 11) + '…' : rName;

                if (isRendered) {
                    ctx.fillStyle = '#facc15';
                    ctx.font = 'bold 9px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.shadowColor = 'rgba(250, 204, 21, 0.7)';
                    ctx.shadowBlur = 4;
                    ctx.fillText(shortName, rx, ry - rRad - 6);
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = 'rgba(203, 213, 225, 0.65)';
                    ctx.font = '500 8px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(shortName, rx, ry - rRad - 5);
                }
            });
        }

        // Posición y orientación del jugador (siempre en el centro del minimapa)
        const px = centerX;
        const py = centerY;

        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        const lookAngle = Math.atan2(dir.z, dir.x);

        const fovAngle = ((camera.fov || 75) * Math.PI) / 180 * 0.5;
        const fovLength = 26;

        // Cono de visión con gradiente radial
        const grad = ctx.createRadialGradient(px, py, 2, px, py, fovLength);
        grad.addColorStop(0, 'rgba(250, 204, 21, 0.55)');
        grad.addColorStop(1, 'rgba(250, 204, 21, 0.0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.arc(px, py, fovLength, lookAngle - fovAngle, lookAngle + fovAngle);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(lookAngle - fovAngle) * fovLength, py + Math.sin(lookAngle - fovAngle) * fovLength);
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(lookAngle + fovAngle) * fovLength, py + Math.sin(lookAngle + fovAngle) * fovLength);
        ctx.stroke();

        // Línea direccional
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(lookAngle) * 14, py + Math.sin(lookAngle) * 14);
        ctx.stroke();

        // Punto central del jugador
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.stroke();
    }
}

export { MinimapRenderer };
