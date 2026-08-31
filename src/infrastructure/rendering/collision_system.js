/**
 * @file collision_system.js
 * @description Sistema de colisiones 2D por segmentos, cajas y obstáculos con resolución de deslizamiento.
 */

import * as THREE from 'three';

/**
 * Sistema de colisiones 2D CollisionSystem.
 */
class CollisionSystem {

    /**
     * Inicializa las colecciones de colisionadores.
     */
    constructor() {
        this.wallColliders = [];
        this.boxColliders = [];
        this.obstacleColliders = [];
    }

    /**
     * Limpia todos los colisionadores registrados.
     * @returns {void}
     */
    clear() {
        this.wallColliders = [];
        this.boxColliders = [];
        this.obstacleColliders = [];
    }

    /**
     * Registra un colisionador de segmento de pared.
     * @param {number} x1 - Coordenada X inicial.
     * @param {number} z1 - Coordenada Z inicial.
     * @param {number} x2 - Coordenada X final.
     * @param {number} z2 - Coordenada Z final.
     * @returns {void}
     */
    addSegmentCollider(x1, z1, x2, z2) {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const len = Math.hypot(dx, dz);
        if (len < 1e-6) return;

        this.wallColliders.push({
            x1, z1, x2, z2,
            nx: -dz / len,
            nz: dx / len,
            len
        });
    }

    /**
     * Registra un colisionador de caja AABB.
     * @param {number} minX - Límite mínimo en X.
     * @param {number} maxX - Límite máximo en X.
     * @param {number} minZ - Límite mínimo en Z.
     * @param {number} maxZ - Límite máximo en Z.
     * @returns {void}
     */
    addBoxCollider(minX, maxX, minZ, maxZ) {
        this.boxColliders.push({ minX, maxX, minZ, maxZ });
    }

    /**
     * Registra un colisionador de obstáculo cilíndrico / circular.
     * @param {number} x - Coordenada X del centro.
     * @param {number} z - Coordenada Z del centro.
     * @param {number} radius - Radio del obstáculo.
     * @returns {void}
     */
    addObstacleCollider(x, z, radius) {
        this.obstacleColliders.push({ x, z, radius });
    }

    /**
     * Resuelve colisiones contra todos los segmentos de pared mediante proyección ortogonal y deslizamiento.
     * @param {number} px - Posición actual en X del jugador.
     * @param {number} pz - Posición actual en Z del jugador.
     * @param {number} radius - Radio de colisión del jugador.
     * @returns {THREE.Vector2} Posición ajustada.
     */
    resolveSegmentCollision(px, pz, radius) {
        let curX = px;
        let curZ = pz;

        for (let iter = 0; iter < 4; iter++) {
            let collided = false;

            for (const col of this.wallColliders) {
                const segX = col.x2 - col.x1;
                const segZ = col.z2 - col.z1;
                const segLenSq = col.len * col.len;

                let t = ((curX - col.x1) * segX + (curZ - col.z1) * segZ) / segLenSq;
                t = Math.max(0, Math.min(1, t));

                const closeX = col.x1 + t * segX;
                const closeZ = col.z1 + t * segZ;

                const distX = curX - closeX;
                const distZ = curZ - closeZ;
                const distSq = distX * distX + distZ * distZ;

                if (distSq < radius * radius && distSq > 1e-8) {
                    const dist = Math.sqrt(distSq);
                    const overlap = radius - dist;
                    const pushX = distX / dist;
                    const pushZ = distZ / dist;

                    curX += pushX * overlap;
                    curZ += pushZ * overlap;
                    collided = true;
                }
            }

            if (!collided) break;
        }

        return new THREE.Vector2(curX, curZ);
    }

    /**
     * Resuelve colisiones contra cajas AABB.
     * @param {number} px - Posición actual en X.
     * @param {number} pz - Posición actual en Z.
     * @param {number} radius - Radio de colisión del jugador.
     * @returns {THREE.Vector2} Posición ajustada.
     */
    resolveBoxCollisions(px, pz, radius) {
        let curX = px;
        let curZ = pz;

        for (const box of this.boxColliders) {
            const expMinX = box.minX - radius;
            const expMaxX = box.maxX + radius;
            const expMinZ = box.minZ - radius;
            const expMaxZ = box.maxZ + radius;

            if (curX > expMinX && curX < expMaxX && curZ > expMinZ && curZ < expMaxZ) {
                const dLeft = curX - expMinX;
                const dRight = expMaxX - curX;
                const dTop = curZ - expMinZ;
                const dBottom = expMaxZ - curZ;
                const minD = Math.min(dLeft, dRight, dTop, dBottom);

                if (minD === dLeft) curX = expMinX;
                else if (minD === dRight) curX = expMaxX;
                else if (minD === dTop) curZ = expMinZ;
                else curZ = expMaxZ;
            }
        }

        return new THREE.Vector2(curX, curZ);
    }

    /**
     * Resuelve colisiones contra obstáculos circulares (pedestales, esculturas).
     * @param {number} px - Posición actual en X.
     * @param {number} pz - Posición actual en Z.
     * @param {number} radius - Radio de colisión del jugador.
     * @returns {THREE.Vector2} Posición ajustada.
     */
    resolveObstacleCollisions(px, pz, radius) {
        let curX = px;
        let curZ = pz;

        for (const obs of this.obstacleColliders) {
            const dx = curX - obs.x;
            const dz = curZ - obs.z;
            const dist = Math.hypot(dx, dz);
            const minDist = radius + obs.radius;

            if (dist < minDist && dist > 1e-6) {
                const overlap = minDist - dist;
                curX += (dx / dist) * overlap;
                curZ += (dz / dist) * overlap;
            }
        }

        return new THREE.Vector2(curX, curZ);
    }

    /**
     * Resuelve colisiones combinadas de segmentos, cajas y obstáculos.
     * @param {number} px - Posición actual en X.
     * @param {number} pz - Posición actual en Z.
     * @param {number} [radius=0.45] - Radio de colisión.
     * @returns {THREE.Vector2} Posición final corregida.
     */
    resolveCollisions(px, pz, radius = 0.45) {
        let corrected = this.resolveSegmentCollision(px, pz, radius);
        corrected = this.resolveBoxCollisions(corrected.x, corrected.y, radius);
        corrected = this.resolveObstacleCollisions(corrected.x, corrected.y, radius);
        return corrected;
    }

    /**
     * Actualiza la posición aplicando rotación, fricción, aceleración y resolución de colisiones.
     * @param {object} params
     * @returns {void}
     */
    updateMovement({ camera, controls, velocity, direction, moveForward, moveBackward, turnLeft, turnRight, delta, playerRadius }) {
        const dTime = Math.min(delta, 0.1);

        const turnSpeed = 1.65;
        const leftFactor = typeof turnLeft === 'number' ? turnLeft : (turnLeft ? 1.0 : 0.0);
        const rightFactor = typeof turnRight === 'number' ? turnRight : (turnRight ? 1.0 : 0.0);
        if (leftFactor > 0) camera.rotation.y += turnSpeed * leftFactor * dTime;
        if (rightFactor > 0) camera.rotation.y -= turnSpeed * rightFactor * dTime;
        camera.rotation.z = 0;

        velocity.z -= velocity.z * 10.0 * dTime;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.normalize();

        const moveSpeed = 70.0;
        const isMoving = moveForward || moveBackward;
        if (isMoving) velocity.z -= direction.z * moveSpeed * dTime;

        const playerObj = controls.getObject ? controls.getObject() : camera;

        controls.moveForward(-velocity.z * dTime);

        const corrected = this.resolveCollisions(playerObj.position.x, playerObj.position.z, playerRadius);
        playerObj.position.x = corrected.x;
        playerObj.position.z = corrected.y;
    }
}

export { CollisionSystem };
