function drawTitleBlock(
    pdf,
    x0,
    y0
) {

    pdf.setDrawColor(0);
    pdf.setLineWidth(0.2);

    // Общий контур
    pdf.rect(
        x0,
        y0,
        100,
        31
    );

    // Горизонтали
    pdf.line(
        x0,
        y0 + 10,
        x0 + 100,
        y0 + 10
    );

    pdf.line(
        x0,
        y0 + 17,
        x0 + 100,
        y0 + 17
    );

    pdf.line(
        x0,
        y0 + 20.5,
        x0 + 100,
        y0 + 20.5
    );

    pdf.line(
        x0,
        y0 + 24.0,
        x0 + 100,
        y0 + 24.0
    );

    pdf.line(
        x0,
        y0 + 27.5,
        x0 + 100,
        y0 + 27.5
    );

    // Вертикали
    pdf.line(
        x0 + 12.8,
        y0 + 10,
        x0 + 12.8,
        y0 + 31
    );

    pdf.line(
        x0 + 47.2,
        y0 + 10,
        x0 + 47.2,
        y0 + 31
    );

    pdf.line(
        x0 + 65.0,
        y0 + 10,
        x0 + 65.0,
        y0 + 31
    );

    pdf.line(
        x0 + 81.0,
        y0 + 10,
        x0 + 81.0,
        y0 + 31
    );

}

let isAdmin = false;

const ADMIN_PASSWORD =
    "0000";

async function loadPhotoData(
    project,
    file
) {

const ref =
    window.firebaseApi.doc(
        window.firebaseApi.db,
        "projects",
        project,
        "photos",
        file
    );

const snap =
    await window.firebaseApi.getDoc(
        ref
    );

    if (
        snap.exists()
    ) {

        return snap.data();

    }

    return null;
}

async function savePhotoData(
    project,
    file,
    data
) {

const ref =
    window.firebaseApi.doc(
        window.firebaseApi.db,
        "projects",
        project,
        "photos",
        file
    );

await window.firebaseApi.setDoc(
    ref,
    {
        ...data,

        updatedAt:
            window.firebaseApi
                .serverTimestamp()
    },
    {
        merge: true
    }
);

}

async function loadDiary() {

    const response =
        await fetch("diary.json");

    const data =
        await response.json();

    const gallery =
        document.getElementById("gallery");

    const title =
        document.getElementById("project-title");

    const info =
        document.getElementById("project-info");

    title.textContent =
        data.project.toUpperCase();

    const days =
        Object.keys(data.days)
              .sort();

    let photoCount = 0;

    for (const day of days) {

        photoCount +=
            data.days[day].length;

    }

    const firstDay =
        days[0];

    const lastDay =
        days[days.length - 1];

    info.innerHTML =
        `${firstDay} — ${lastDay}<br>` +
        `${photoCount} photos`;

    days.reverse();

    for (const day of days) {

        const section =
            document.createElement("div");

        section.className =
            "day";

        section.innerHTML =
            `<h2>${day}</h2>`;

        const photos =
            document.createElement("div");

        photos.className =
            "photos";

for (const file of data.days[day]) {

    const comment = "";

            const project =
                data.project;

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "photo-wrapper";

            const checkbox =
                document.createElement("input");

            checkbox.type =
                "checkbox";

            checkbox.className =
                "photo-check";

            checkbox.addEventListener(
                "change",
                updateSelectionCount
            );

            const img =
                document.createElement("img");

            img.src =
                `diary/${day}/thumb/${file}`;

            img.dataset.day = day;

            img.onclick = () => {

                window.open(
                    `diary/${day}/full/${file}`,
                    "_blank"
                );

            };

            wrapper.appendChild(
                checkbox
            );

            wrapper.appendChild(
                img
            );

            const textarea =
                document.createElement(
                    "textarea"
                );

            textarea.className =
                "photo-comment";

            textarea.rows = 3;

            textarea.placeholder =
                "Comment...";

textarea.value =
    comment;

loadPhotoData(
    project,
    file
).then(
    cloud => {

        if (
            cloud
        ) {

            textarea.value =
                cloud.comment || "";

        }

    }
);

textarea.readOnly =
    !isAdmin;

textarea.style.display =
    isAdmin
        ? "block"
        : "none";

textarea.dataset.day =
    day;

textarea.dataset.file =
    file;

const storageKey =
    `${project}_${day}_${file}`;

//const savedComment =
//    localStorage.getItem(
//        storageKey
//    );
//
//if (
//    savedComment !== null
//) {
//
//    textarea.value =
//        savedComment;
//
//}

const expandButton =
    document.createElement(
        "button"
    );

expandButton.textContent =
    "⛶";

expandButton.className =
    "expand-comment";

expandButton.style.display =
    isAdmin
        ? "block"
        : "none";

expandButton.onclick =
    () => {

        openCommentEditor(
            textarea
        );

    };

wrapper.appendChild(
    expandButton
);
            wrapper.appendChild(
                textarea
            );

            photos.appendChild(
                wrapper
            );
        }

        section.appendChild(
            photos
        );

        gallery.appendChild(
            section
        );
    }
}

function updateSelectionCount() {

    const count =
        document.querySelectorAll(
            ".photo-check:checked"
        ).length;

    document.getElementById(
        "selection-info"
    ).textContent =
        `Selected: ${count} photos`;
}

loadDiary();

document
    .getElementById(
        "select-all"
    )
    .addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".photo-check"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            true;

                    }
                );

            updateSelectionCount();
        }
    );

document
    .getElementById(
        "clear-all"
    )
    .addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".photo-check"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            false;

                    }
                );

            updateSelectionCount();
        }
    );

document
    .getElementById(
        "export-pdf"
    )
    .addEventListener(
        "click",
        async () => {

            document
                .querySelectorAll(
                    ".pdf-error"
                )
                .forEach(
                    e => e.classList.remove(
                        "pdf-error"
                    )
                );

            document
                .querySelectorAll(
                    ".comment-error"
                )            .forEach(
                    e => e.classList.remove(
                        "comment-error"
                    )
                );

            const selected =
                document.querySelectorAll(
                    ".photo-check:checked"
                );

            const photos =
                Array.from(selected);

            if (
                selected.length === 0
            ) {

                alert(
                    "No photos selected"
                );

                return;
            }

            const {
                jsPDF
            } = window.jspdf;

            const pdf =
                new jsPDF(
                    "portrait",
                    "mm",
                    "a4"
                );

            const project =
                document
                    .getElementById(
                        "project-title"
                    )
                    .textContent;

const pageWidth = 210;
const pageHeight = 297;

// Рамка листа
pdf.setLineWidth(0.25);

pdf.rect(
    20,  // X
    5,   // Y
    185, // ширина
    287  // высота
);

drawTitleBlock(
    pdf,
    105,
    261
);

// Размер ячейки фото
const cellW = 85;
const cellH = 65;


const totalPages =
    Math.ceil(
        selected.length / 4
    );

let i = 0;
let page = 1;

let hasErrors = false;

while (
    i < photos.length
) {

const testPhotos =
    photos.slice(
        i,
        i + 4
    );

const hasComments =
    testPhotos.some(
        photo => {

            const wrapper =
                photo.parentElement;

            const comment =
                wrapper
                    .querySelector(
                        ".photo-comment"
                    )
                    ?.value || "";

            return (
                comment.trim() !== ""
            );

        }
    );

let pagePhotos;
let positions;

if (
    hasComments
) {

    pagePhotos = 2;

    positions = [

        {x: 25, y: 25},
        {x: 115, y: 25},

    ];

} else {

    pagePhotos = 4;

    positions = [

        {x: 25, y: 25},
        {x: 115, y: 25},

        {x: 25, y: 120},
        {x: 115, y: 120},

    ];
}


// Заголовок страницы

pdf.setFontSize(
    16
);

pdf.text(
    project,
    pageWidth / 2,
    12,
    {
        align:
            "center"
    }
);

pdf.setFontSize(
    9
);

pdf.text(
    `Page ${page}`,
    202,
    12,
    {
        align:
            "right"
    }
);

for (
    let j = 0;
    j < pagePhotos &&
    i + j < photos.length;
    j++
) {

    const checkbox =
        photos[
            i + j
        ];

    const pos =
        positions[
            j
        ];

    const wrapper =
        checkbox.parentElement;

    const comment =
        wrapper.querySelector(
            ".photo-comment"
        )?.value || "";

    const img =
        wrapper.querySelector(
            "img"
        );

    const image =
        new Image();

    image.crossOrigin =
        "anonymous";

    image.src =
        img.src.replace(
            "/thumb/",
            "/full/"
        );

    await new Promise(
        resolve => {

            image.onload =
                resolve;

        }
    );

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        image.width;

    canvas.height =
        image.height;

    const ctx =
        canvas.getContext(
            "2d"
        );

    ctx.drawImage(
        image,
        0,
        0
    );

    const dataUrl =
        canvas.toDataURL(
            "image/jpeg",
            0.95
        );

    // Сохранение пропорций
    const scale =
        Math.min(
            cellW /
                image.width,
            cellH /
                image.height
        );

    const drawW =
        image.width *
        scale;

    const drawH =
        image.height *
        scale;

    const drawX =
        pos.x +
        (
            cellW -
            drawW
        ) / 2;

    const drawY =
        pos.y +
        (
            cellH -
            drawH
        ) / 2;

// Рамка ячейки
pdf.setDrawColor(180);
pdf.setLineWidth(0.15);

pdf.rect(
    pos.x,
    pos.y,
    cellW,
    cellH
);

// Фото
    pdf.addImage(
        dataUrl,
        "JPEG",
        drawX,
        drawY,
        drawW,
        drawH
    );

// Дата
    const day =
        img.dataset.day;

pdf.setFontSize(
    8
);

pdf.text(
    day,
    pos.x +
        cellW / 2,
    pos.y +
        cellH +
        6,
    {
        align:
            "center"
    }
);

const fileName =
    img.src
        .split("/")
        .pop();

pdf.setFontSize(8);

pdf.text(
    fileName,
    pos.x + cellW / 2,
    pos.y + cellH + 11,
    {
        align: "center"
    }
);

if (
    comment.trim()
        .length > 0
) {

    pdf.setFontSize(
        7
    );

    let lines =
        pdf.splitTextToSize(
            comment,
            cellW - 4
        );

if (
    lines.length > 55
) {

    img.classList.add(
        "pdf-error"
    );

    wrapper
        .querySelector(
            ".photo-comment"
        )
        .classList
        .add(
            "comment-error"
        );

    hasErrors = true;
}

    pdf.text(
        lines,
        pos.x + 2,
        pos.y + cellH + 16
    );
}

}

    // Колонтитул
    if (
        i % 4 === 3 ||
        i ===
            selected.length - 1
    ) {

        const now =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );

        pdf.setFontSize(
            8
        );

        pdf.text(
            `Generated by Photo Diary • ${now}`,
            155,
            295
        );

}

i += pagePhotos;

page++;

if (
    i < photos.length
) {

    pdf.addPage();

    pdf.setLineWidth(
        0.25
    );

    pdf.rect(
        20,
        5,
        185,
        287
    );

    drawTitleBlock(
        pdf,
        105,
        261
    );
}

}

const now =
    new Date()
        .toISOString()
        .slice(
            0,
            10
        );

if (
    hasErrors
) {

    alert(
        "One or more comments exceed "
        + "the maximum limit of 55 PDF lines.\n\n"
        + "The photos and comments "
        + "containing errors have "
        + "been highlighted in red."
    );

    return;
}

pdf.save(
    `${project}_${now}.pdf`
);
        }
    );

document
    .getElementById(
        "admin-btn"
    )
    .addEventListener(
        "click",
        () => {

            // Выход из режима администратора
            if (isAdmin) {

    document
        .querySelectorAll(
            ".photo-comment"
        )
        .forEach(
            textarea => {

                const project =
                    document
                        .getElementById(
                            "project-title"
                        )
                        .textContent;

                const key =
                    `${project}_${textarea.dataset.day}_${textarea.dataset.file}`;

//                localStorage.setItem(
//                    key,
//                    textarea.value
//                );

            }
        );

                isAdmin = false;

                document
                    .querySelectorAll(
                        ".photo-comment"
                    )
                    .forEach(
                        textarea => {

                            textarea.readOnly =
                                true;

                            textarea.style.display =
                                "none";

                        }
                    );

                document
                    .querySelectorAll(
                        ".expand-comment"
                    )
                    .forEach(
                        button => {

                            button.style.display =
                                "none";

                        }
                    );

                document
                    .getElementById(
                        "admin-btn"
                    )
                    .textContent =
                        "Admin";

                alert(
                    "Admin mode disabled"
                );

                return;
            }

            // Вход в режим администратора
            const password =
                prompt(
                    "Admin password"
                );

            if (
                password !==
                ADMIN_PASSWORD
            ) {

                alert(
                    "Wrong password"
                );

                return;
            }

            isAdmin = true;

            document
                .querySelectorAll(
                    ".photo-comment"
                )
                .forEach(
                    textarea => {

                        textarea.readOnly =
                            false;

                        textarea.style.display =
                            "block";

                    }
                );

            document
                .querySelectorAll(
                    ".expand-comment"
                )
                .forEach(
                    button => {

                        button.style.display =
                            "block";

                    }
                );

            document
                .getElementById(
                    "admin-btn"
                )
                .textContent =
                    "Logout";

            alert(
                "Admin mode enabled"
            );
        }
    );

let currentTextarea =
    null;



function openCommentEditor(
    sourceTextarea
) {

    currentTextarea =
        sourceTextarea;

    document
        .getElementById(
            "editor-text"
        )
        .value =
            sourceTextarea.value;

    document
        .getElementById(
            "editor-modal"
        )
        .style.display =
            "flex";
}


function closeCommentEditor() {

    document
        .getElementById(
            "editor-modal"
        )
        .style.display =
            "none";

    currentTextarea =
        null;
}



function saveCommentEditor() {

    if (!currentTextarea)
        return;

    currentTextarea.value =
        document
            .getElementById(
                "editor-text"
            )
            .value;

const project =
    document
        .getElementById(
            "project-title"
        )
        .textContent;

savePhotoData(
    project,
    currentTextarea.dataset.file,
    {
        day:
            currentTextarea.dataset.day,

        comment:
            currentTextarea.value
    }
);

    closeCommentEditor();
}

document
    .getElementById(
        "editor-save"
    )
    .addEventListener(
        "click",
        saveCommentEditor
    );


document
    .getElementById(
        "editor-cancel"
    )
    .addEventListener(
        "click",
        closeCommentEditor
    );


let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const modal =
    document.getElementById(
        "editor-window"
    );

const header =
    document.getElementById(
        "editor-header"
    );

header.addEventListener(
    "mousedown",
    e => {

        isDragging = true;

        offsetX =
            e.clientX -
            modal.offsetLeft;

        offsetY =
            e.clientY -
            modal.offsetTop;
    }
);

document.addEventListener(
    "mousemove",
    e => {

        if (!isDragging)
            return;

        modal.style.left =
            (e.clientX - offsetX)
            + "px";

        modal.style.top =
            (e.clientY - offsetY)
            + "px";
    }
);

document.addEventListener(
    "mouseup",
    () => {

        isDragging = false;
    }
);

document
    .getElementById(
        "editor-close"
    )
    .addEventListener(
        "click",
        closeCommentEditor
    );