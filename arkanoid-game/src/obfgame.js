let isCircleBoundToBox = false; 

export function createCircle() {
    document.addEventListener('click', create);
}

export function create(event) {
    const div = document.createElement('div');
    div.classList.add('circle');
    const x = event.clientX - 25;
    const y = event.clientY - 25;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.background = 'white';
    document.body.append(div);
}

export function moveCircle() {
    document.addEventListener('mousemove', move);
}

export function move(event) {
    const circle = document.querySelector('.circle:last-of-type');
    if (!circle) return;

    const box = document.querySelector('.box');
    if (!box) return;

    const boxRect = box.getBoundingClientRect();
    let x = event.clientX - 25;
    let y = event.clientY - 25;

    const circleRect = circle.getBoundingClientRect();

    const isInsideBox = (
        circleRect.left >= boxRect.left &&
        circleRect.right <= boxRect.right &&
        circleRect.top >= boxRect.top &&
        circleRect.bottom <= boxRect.bottom
    );

    if (isInsideBox) {
        isCircleBoundToBox = true;
    } else {
        isCircleBoundToBox = false;
    }

    if (isCircleBoundToBox) {
        x = Math.max(boxRect.left, Math.min(x, boxRect.right - 50));
        y = Math.max(boxRect.top, Math.min(y, boxRect.bottom - 50));
        circle.style.background = 'var(--purple)';
    }

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
}

export function setBox() {
    const box = document.createElement('div');
    box.classList.add('box');
    document.body.append(box);

    moveCircle();
}